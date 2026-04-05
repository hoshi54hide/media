/**
 * AI Tool Selection Quiz Logic
 * Part of AI入門メディア
 */

const quizData = {
    step1: {
        question: "何をしてみたいですか？",
        options: [
            { text: "文章を書いたり相談したい", next: "step2_text" },
            { text: "本物のような画像を作りたい", next: "result_midjourney" },
            { text: "プログラミングの助けがほしい", next: "step2_code" },
            { text: "AIエージェントと開発したい", next: "result_antigravity" }
        ]
    },
    step2_text: {
        question: "どのような文章が中心ですか？",
        options: [
            { text: "丁寧で自然な日本語がいい", next: "result_claude" },
            { text: "多機能で検索も使いたい", next: "result_chatgpt" }
        ]
    },
    step2_code: {
        question: "エンジニア向けの高度な機能は必要ですか？",
        options: [
            { text: "はい、最新のモデルがいい", next: "result_claude" },
            { text: "いいえ、まずは基本から", next: "result_chatgpt" }
        ]
    },
    results: {
        result_chatgpt: {
            title: "ChatGPT",
            description: "最も有名で多機能なAIです。スマホアプリも使いやすく、画像生成やウェブ検索もこれ一つでこなせます。",
            url: "articles/chatgpt-basic.html"
        },
        result_claude: {
            title: "Claude 3.5",
            description: "日本語が非常に自然で、長い文章の要約やプログラミングに強いAIです。知的な会話を楽しみたいならこれ！",
            url: "articles/claude-basic.html"
        },
        result_midjourney: {
            title: "Midjourney",
            description: "圧倒的な画質を誇る画像生成AIです。プロ級のイラストや写真のような画像を言葉だけで作れます。",
            url: "articles/midjourney-guide.html"
        },
        result_antigravity: {
            title: "Antigravity",
            description: "あなたの指示に従って自律的にコードを書き、ファイルを操作し、ブラウザで検証まで行う次世代のAIアシスタントです。",
            url: "articles/antigravity-guide.html"
        }
    }
};

let currentStep = "step1";

function renderQuiz() {
    const container = document.getElementById("quizContainer");
    if (!container) return;

    const data = quizData[currentStep];
    if (!data) return;

    let html = `<h2>${data.question}</h2>`;
    html += `<div class="quiz-options">`;
    data.options.forEach(opt => {
        html += `<button class="quiz-btn" onclick="handleQuizSelection('${opt.next}')">${opt.text}</button>`;
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
        <div class="quiz-result" style="display:block">
            <h3>あなたにおすすめなのは...</h3>
            <h2 style="color:var(--primary); font-size:3rem; margin:1rem 0;">${result.title}</h2>
            <p>${result.description}</p>
            <div style="margin-top:2rem;">
                <a href="${result.url}" class="logo" style="display:inline-block; background:var(--primary); color:white; padding: 1rem 2rem; border-radius:3rem;">解説記事を読む</a>
                <button class="quiz-btn" style="margin-left:1rem;" onclick="resetQuiz()">もう一度診断する</button>
            </div>
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
