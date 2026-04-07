/**
 * AI Tool Selection Quiz Logic
 * Part of AI入門メディア
 */

const quizData = {
    step1: {
        question: "どのようなことにAI（人工知能）を使ってみたいですか？",
        options: [
            { text: "手紙や文章作成、日々の調べ物", next: "step2_biz" },
            { text: "きれいな絵や思い出の画像を作りたい", next: "result_midjourney" },
            { text: "難しい情報の整理や、知的な相談相手がほしい", next: "step3_pro" },
            { text: "パソコンの操作を代わりにやってほしい", next: "result_antigravity" }
        ]
    },
    step2_biz: {
        question: "どちらの使い方が理想に近いですか？",
        options: [
            { text: "丁寧な日本語で、考えをまとめてほしい", next: "result_claude" },
            { text: "調べ物から画像作りまで、何でも任せたい", next: "result_chatgpt" }
        ]
    },
    step3_pro: {
        question: "どのような相談をしたいですか？",
        options: [
            { text: "長文の読み込みや、深い思考の整理", next: "result_claude" },
            { text: "自律的に動く最新技術の活用", next: "result_antigravity" }
        ]
    },
    results: {
        result_chatgpt: {
            title: "ChatGPT（チャット・ジーピーティー）",
            matchReason: "「物知りの相談役」として、あなたの趣味や調べ物を全力でサポートします。まずは気軽に話しかけてみてください！",
            url: "https://chatgpt.com/", 
            articleUrl: "articles/chatgpt-basic.html"
        },
        result_claude: {
            title: "Claude 3.5（クロード）",
            matchReason: "「丁寧な秘書」のように、綺麗な日本語であなたの考えを整えてくれます。読書感想文やお手紙の下書きにも最適です。",
            url: "https://claude.ai/", 
            articleUrl: "articles/claude-basic.html"
        },
        result_midjourney: {
            title: "Midjourney（ミッドジャーニー）",
            matchReason: "「魔法の絵筆」です。言葉でイメージを伝えるだけで、プロのような美しい絵や写真が驚くほど簡単に作れます。",
            url: "https://www.midjourney.com/", 
            articleUrl: "articles/midjourney-guide.html"
        },
        result_antigravity: {
            title: "Antigravity（アンチグラビティ）",
            matchReason: "「未来の執事」です。単なるお喋りだけでなく、あなたの代わりに難しい作業やパソコン操作を自律的にこなしてくれます。",
            url: "https://antigravity.google/", 
            articleUrl: "articles/antigravity-guide.html"
        }
    }
};

let currentStep = "step1";

function renderQuiz() {
    const container = document.getElementById("quizContainer");
    if (!container) return;

    const data = quizData[currentStep];
    if (!data) return;

    let html = `<h2 class="quiz-question">${data.question}</h2>`;
    html += `<div class="quiz-options">`;
    data.options.forEach((opt, index) => {
        html += `<button class="quiz-btn" style="animation-delay: ${index * 0.1}s" onclick="handleQuizSelection('${opt.next}')">${opt.text}</button>`;
    });
    html += `</div>`;

    container.innerHTML = html;
}

function handleQuizSelection(next) {
    if (next.startsWith("result_")) {
        showResult(next);
    } else {
        currentStep = next;
        renderQuiz();
    }
}

function showResult(resultKey) {
    const container = document.getElementById("quizContainer");
    const result = quizData.results[resultKey];

    let html = `
        <div class="quiz-result animate-in">
            <p class="result-label">あなたにおすすめのAIは...</p>
            <h2 class="result-title">${result.title}</h2>
            <div class="result-match">
                <strong>診断結果：</strong>
                <p>${result.matchReason}</p>
            </div>
            <div class="result-actions">
                <a href="${result.url}" target="_blank" class="cta-btn primary">今すぐ無料で始める <span>🚀</span></a>
                <a href="${result.articleUrl}" class="cta-btn secondary">使い方を詳しく見る</a>
            </div>
            <button class="reset-link" onclick="resetQuiz()">もう一度診断する</button>
        </div>
    `;

    container.innerHTML = html;
}

function resetQuiz() {
    currentStep = "step1";
    renderQuiz();
}

// Initialize quiz when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("quizContainer")) {
        renderQuiz();
    }
});
