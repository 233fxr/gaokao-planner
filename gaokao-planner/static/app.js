/**
 * 高考复习规划助手 — Frontend App
 * Handles tab switching, API calls with timeout/error handling, and UI updates.
 */

(function () {
  "use strict";

  // --- Configuration ---
  const API_BASE = "";
  const TIMEOUT_QUESTIONS = 120_000; // 120s
  const TIMEOUT_PLAN = 180_000; // 180s

  // --- State ---
  const state = {
    currentQuestions: null,
    currentPlan: null,
  };

  // --- DOM refs ---
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const tabs = $$(".tab-btn");
  const panels = {
    questions: $("#panel-questions"),
    plan: $("#panel-plan"),
  };

  // Question elements
  const queryInput = $("#query-input");
  const btnGenerate = $("#btn-generate");
  const qLoading = $("#questions-loading");
  const qError = $("#questions-error");
  const qEmpty = $("#questions-empty");
  const qContent = $("#questions-content");
  const qMeta = $("#questions-meta");
  const qBody = $("#questions-body");
  const qAnswer = $("#questions-answer");
  const qAnswerBody = $("#questions-answer-body");

  // Plan elements
  const planName = $("#plan-name");
  const planHours = $("#plan-hours");
  const planStart = $("#plan-start");
  const planEnd = $("#plan-end");
  const planSubjects = $("#plan-subjects");
  const planWeak = $("#plan-weak");
  const btnPlan = $("#btn-plan");
  const pLoading = $("#plan-loading");
  const pError = $("#plan-error");
  const pEmpty = $("#plan-empty");
  const pContent = $("#plan-content");
  const pBody = $("#plan-body");

  const toastContainer = $("#toast-container");

  // --- Utility: Toast ---
  function showToast(message, type = "success") {
    const colors = {
      success: "bg-green-50 border-green-200 text-green-800",
      error: "bg-red-50 border-red-200 text-red-800",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
      info: "bg-blue-50 border-blue-200 text-blue-800",
    };
    const el = document.createElement("div");
    el.className = `toast border rounded-lg px-4 py-3 text-sm shadow-lg ${colors[type] || colors.info}`;
    el.textContent = message;
    toastContainer.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateX(40px)";
      setTimeout(() => el.remove(), 300);
    }, 4000);
  }

  // --- Utility: show/hide helpers ---
  function setVisibility(el, visible) {
    if (!el) return;
    el.classList.toggle("hidden", !visible);
  }

  function showOnly(...showEls) {
    const all = [qLoading, qError, qEmpty, qContent, pLoading, pError, pEmpty, pContent];
    all.forEach((el) => setVisibility(el, showEls.includes(el)));
  }

  // --- Tab switching ---
  function switchTab(name) {
    tabs.forEach((t) => {
      const isActive = t.dataset.tab === name;
      t.classList.toggle("tab-active", isActive);
      t.classList.toggle("text-gray-500", !isActive);
      t.classList.toggle("text-primary-600", isActive);
      t.classList.toggle("border-primary-500", isActive);
      t.classList.toggle("border-transparent", !isActive);
    });
    setVisibility(panels.questions, name === "questions");
    setVisibility(panels.plan, name === "plan");
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  // --- Utility: format markdown-like text ---
  function renderText(text) {
    if (!text) return "";
    let html = String(text);
    // Escape HTML
    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // Code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre><code>${code.trim()}</code></pre>`;
    });
    // Inline code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    // LaTeX
    html = html.replace(/\$\$(.+?)\$\$/g, '<span class="text-blue-600 font-mono">$$$1$$</span>');
    html = html.replace(/\$(.+?)\$/g, '<span class="text-blue-600 font-mono">$$$1$$</span>');
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    // Newlines to paragraphs
    html = html
      .split(/\n{2,}/)
      .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
      .join("");
    return html;
  }

  // --- Utility: classification error ---
  function classifyError(err, elapsed) {
    if (elapsed >= TIMEOUT_QUESTIONS) {
      return { type: "warning", message: "请求超时。生成题目较慢，请重试或简化描述。" };
    }
    if (err instanceof DOMException && err.name === "AbortError") {
      return { type: "warning", message: "请求超时。生成题目较慢，请重试或简化描述。" };
    }
    if (err.message?.includes("429") || err.message?.includes("rate limit")) {
      return { type: "info", message: "API 频率限制，请稍后重试。" };
    }
    if (err.message?.includes("500") || err.message?.includes("Internal Server Error")) {
      return { type: "error", message: "服务端错误，请稍后重试。" };
    }
    return { type: "error", message: `网络异常：${err.message || "请检查网络连接"}` };
  }

  function applyError(el, errInfo) {
    const colors = {
      warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
      error: "border-red-200 bg-red-50 text-red-800",
      info: "border-blue-200 bg-blue-50 text-blue-800",
    };
    el.className = `rounded-xl border p-4 text-sm ${colors[errInfo.type] || colors.error}`;
    el.textContent = errInfo.message;
  }

  // --- API: fetch with AbortController ---
  async function apiFetch(url, body, timeout) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (!res.ok) {
        const text = await res.text();
        let detail = "";
        try {
          detail = JSON.parse(text).detail || text;
        } catch {
          detail = text;
        }
        throw new Error(`${res.status}: ${detail}`);
      }
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  // --- Questions ---
  btnGenerate.addEventListener("click", async () => {
    const query = queryInput.value.trim();
    if (!query) {
      showToast("请输入题目描述", "warning");
      queryInput.focus();
      return;
    }

    btnGenerate.disabled = true;
    const startTime = Date.now();
    showOnly(qLoading);

    try {
      const data = await apiFetch(
        `${API_BASE}/api/questions`,
        { query },
        TIMEOUT_QUESTIONS
      );
      state.currentQuestions = data;
      renderQuestions(data);
      showToast("题目生成成功！", "success");
    } catch (err) {
      const elapsed = Date.now() - startTime;
      const errInfo = classifyError(err, elapsed);
      applyError(qError, errInfo);
      showOnly(qError);
    } finally {
      btnGenerate.disabled = false;
    }
  });

  function renderQuestions(data) {
    // Meta tags
    qMeta.innerHTML = "";
    const tags = [];
    if (data.subject)
      tags.push({ label: data.subject, color: "bg-blue-100 text-blue-700" });
    if (data.source)
      tags.push({ label: data.source, color: "bg-gray-100 text-gray-600" });
    if (data.type)
      tags.push({ label: data.type, color: "bg-purple-100 text-purple-700" });
    if (data.difficulty) {
      const diffLabels = { 1: "⭐ 基础", 2: "⭐⭐ 中等", 3: "⭐⭐⭐ 较难", 4: "⭐⭐⭐⭐ 困难", 5: "⭐⭐⭐⭐⭐ 压轴" };
      tags.push({
        label: diffLabels[data.difficulty] || `难度 ${data.difficulty}`,
        color: "bg-orange-100 text-orange-700",
      });
    }
    tags.forEach((t) => {
      const el = document.createElement("span");
      el.className = `inline-block text-xs font-medium px-2.5 py-1 rounded-full ${t.color}`;
      el.textContent = t.label;
      qMeta.appendChild(el);
    });

    // Question body
    qBody.innerHTML = renderText(data.question) || "（题目内容为空）";

    // Answer
    if (data.answer || data.explanation) {
      setVisibility(qAnswer, true);
      let answerHtml = "";
      if (data.answer) answerHtml += `<p><strong>答案：</strong>${renderText(data.answer)}</p>`;
      if (data.explanation) answerHtml += `<div class="mt-3">${renderText(data.explanation)}</div>`;
      qAnswerBody.innerHTML = answerHtml;
    } else {
      setVisibility(qAnswer, false);
    }

    showOnly(qContent);
  }

  // --- Plan ---
  btnPlan.addEventListener("click", async () => {
    const name = planName.value.trim();
    const hours = parseInt(planHours.value, 10);
    const start = planStart.value;
    const end = planEnd.value;
    const subjectsRaw = planSubjects.value.trim();
    const weakRaw = planWeak.value.trim();

    if (!name) {
      showToast("请输入学生姓名", "warning");
      planName.focus();
      return;
    }
    if (!hours || hours <= 0) {
      showToast("请输入有效的每周可用时间", "warning");
      planHours.focus();
      return;
    }
    if (!start || !end) {
      showToast("请选择复习起止日期", "warning");
      return;
    }
    if (!weakRaw) {
      showToast("请填写薄弱知识点", "warning");
      planWeak.focus();
      return;
    }

    const weakPoints = weakRaw.split(/[,，、]/).map((s) => s.trim()).filter(Boolean);
    const subjects = subjectsRaw ? subjectsRaw.split(/[,，、]/).map((s) => s.trim()).filter(Boolean) : undefined;

    btnPlan.disabled = true;
    const startTime = Date.now();
    showOnly(pLoading);

    try {
      const data = await apiFetch(
        `${API_BASE}/api/plan`,
        { name, start_date: start, end_date: end, weak_points: weakPoints, weekly_hours: hours, subjects },
        TIMEOUT_PLAN
      );
      state.currentPlan = data;
      renderPlan(data);
      showToast("复习计划生成成功！", "success");
    } catch (err) {
      const elapsed = Date.now() - startTime;
      const errInfo = classifyError(err, elapsed);
      applyError(pError, errInfo);
      showOnly(pError);
    } finally {
      btnPlan.disabled = false;
    }
  });

  function renderPlan(data) {
    let html = "";

    if (data.overall_goal) {
      html += `<div class="mb-4"><h3 class="text-base font-semibold text-gray-800 mb-1">🎯 总体目标</h3><p class="text-gray-600">${data.overall_goal}</p></div>`;
    }

    if (data.weekly_plans && Array.isArray(data.weekly_plans)) {
      data.weekly_plans.forEach((week) => {
        html += `<div class="mb-6 border border-gray-200 rounded-lg p-4">`;
        html += `<h4 class="font-semibold text-primary-700 mb-2">第 ${week.week} 周：${week.theme || ""}</h4>`;

        if (week.focus_areas && week.focus_areas.length) {
          html += `<div class="flex flex-wrap gap-1.5 mb-3">`;
          week.focus_areas.forEach((area) => {
            html += `<span class="inline-block text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded">${area}</span>`;
          });
          html += `</div>`;
        }

        if (week.daily_schedule && Array.isArray(week.daily_schedule)) {
          week.daily_schedule.forEach((day) => {
            html += `<div class="mb-2"><span class="text-xs font-semibold text-gray-500">${day.day}</span>`;
            if (day.tasks && Array.isArray(day.tasks)) {
              day.tasks.forEach((task) => {
                html += `<div class="ml-3 text-sm text-gray-700 flex gap-2">`;
                html += `<span class="text-gray-400 font-mono text-xs mt-0.5 shrink-0">${task.time || ""}</span>`;
                html += `<span>${task.content || ""}${task.details ? `<span class="text-gray-400"> — ${task.details}</span>` : ""}</span>`;
                html += `</div>`;
              });
            }
            html += `</div>`;
          });
        }

        if (week.weekly_checkpoint) {
          html += `<div class="mt-2 text-xs text-green-600">✅ 本周检测：${week.weekly_checkpoint}</div>`;
        }

        html += `</div>`;
      });
    }

    if (data.tips && Array.isArray(data.tips)) {
      html += `<div class="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">`;
      html += `<h4 class="text-sm font-semibold text-amber-800 mb-2">💡 备考小贴士</h4><ul class="text-sm text-amber-700 space-y-1">`;
      data.tips.forEach((tip) => {
        html += `<li>• ${tip}</li>`;
      });
      html += `</ul></div>`;
    }

    if (!html) {
      html = `<p class="text-gray-500">计划内容为空或格式异常，请查看原始返回。</p>`;
      if (data.raw_response) {
        html += `<pre class="mt-3 bg-gray-50 p-3 rounded text-xs overflow-x-auto">${data.raw_response}</pre>`;
      }
    }

    pBody.innerHTML = html;
    showOnly(pContent);
  }

  // --- Keyboard shortcut ---
  queryInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      btnGenerate.click();
    }
  });

  // --- Init: set default date ---
  function initDates() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    if (!planStart.value) planStart.value = `${y}-${m}-${d}`;
    // Default end: 3 months later
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + 3);
    const ey = endDate.getFullYear();
    const em = String(endDate.getMonth() + 1).padStart(2, "0");
    const ed = String(endDate.getDate()).padStart(2, "0");
    if (!planEnd.value) planEnd.value = `${ey}-${em}-${ed}`;
  }

  initDates();
  console.log("📚 高考复习规划助手已加载");
})();
