/**
 * らくらくAI診断 v2（2026年版）
 * スコア方式：各回答でAIごとに点数を加算し、合計が最も高いAIをおすすめします。
 */

const TOOLS = ["chatgpt", "claude", "gemini", "notebooklm", "perplexity", "midjourney", "antigravity"];

// 同点だったときの優先順位（初心者が始めやすい順）
const TIE_PRIORITY = ["chatgpt", "gemini", "claude", "perplexity", "notebooklm", "midjourney", "antigravity"];

const QUESTIONS = [
    {
        question: "AIで、いちばんやってみたいことは何ですか？",
        options: [
            { text: "✍️ 手紙や挨拶文、文章を書いてほしい", scores: { claude: 5, chatgpt: 1 } },
            { text: "🔍 調べ物や、ニュースの確認をしたい", scores: { perplexity: 5, gemini: 1, chatgpt: 1 } },
            { text: "🎨 きれいな絵や画像を作ってみたい", scores: { midjourney: 5, chatgpt: 1, gemini: 1 } },
            { text: "📚 資料や本の内容を、わかりやすく整理してほしい", scores: { notebooklm: 5, claude: 1 } },
            { text: "💬 気軽な相談相手・話し相手がほしい", scores: { chatgpt: 5, gemini: 1 } },
            { text: "🤖 パソコンの作業を代わりにやってほしい", scores: { antigravity: 5, chatgpt: 2 } }
        ]
    },
    {
        question: "ふだん、よく使うのはどちらですか？",
        options: [
            { text: "📱 ほとんどスマホ", scores: { gemini: 2, chatgpt: 1 } },
            { text: "💻 ほとんどパソコン", scores: { claude: 1, notebooklm: 1, antigravity: 1, perplexity: 1 } },
            { text: "🔄 スマホもパソコンも両方使う", scores: { chatgpt: 1, gemini: 1 } }
        ]
    },
    {
        question: "文字を打つ（入力する）のは得意ですか？",
        options: [
            { text: "⌨️ 打つのは平気です", scores: { claude: 1, notebooklm: 1, perplexity: 1 } },
            { text: "🎤 打つより、話しかける方がラク", scores: { chatgpt: 2, gemini: 1 } }
        ]
    },
    {
        question: "料金については、どうお考えですか？",
        options: [
            { text: "🆓 まずは完全に無料で試したい", scores: { gemini: 2, notebooklm: 1, perplexity: 1, chatgpt: 1, midjourney: -4 } },
            { text: "💰 役に立つなら、月1,500円くらいなら払ってもいい", scores: { midjourney: 1, claude: 1, chatgpt: 1 } }
        ]
    },
    {
        question: "AIに期待するのは、どちらに近いですか？",
        options: [
            { text: "✅ 正しい情報。出どころ（出典）がわかると安心", scores: { perplexity: 2, notebooklm: 2, gemini: 1 } },
            { text: "💡 豊かなアイデアや表現。多少の遊び心も歓迎", scores: { claude: 2, midjourney: 1, chatgpt: 1 } }
        ]
    },
    {
        question: "AIを使った経験はありますか？",
        options: [
            { text: "🌱 まったく初めて", scores: { chatgpt: 2, gemini: 1, antigravity: -2 } },
            { text: "🚶 少しだけ触ったことがある", scores: {} },
            { text: "🏃 けっこう使っている", scores: { antigravity: 2, notebooklm: 1, claude: 1 } }
        ]
    }
];

const RESULTS = {
    chatgpt: {
        typeName: "なんでも相談タイプ",
        title: "ChatGPT（チャット・ジーピーティー）",
        emoji: "💬",
        matchReason: "あなたにぴったりなのは、世界でいちばん使われているAI「ChatGPT」。物知りで話しやすい相談役として、調べ物から雑談まで何でも付き合ってくれます。音声での会話もできるので、文字を打たなくても大丈夫です。",
        freeStuff: [
            "文章の作成・要約・翻訳（回数に上限あり）",
            "スマホアプリで「声だけ」の会話",
            "簡単な画像づくり"
        ],
        firstSteps: [
            "スマホに「ChatGPT」の公式アプリを入れる（App Store / Google Play）",
            "マイクのボタンを押して「おすすめの晩ごはんを3つ教えて」と話しかけてみる",
            "慣れてきたら「〇〇さんへのお礼の手紙を書いて」とお願いしてみる"
        ],
        url: "https://chatgpt.com/",
        articleUrl: "articles/chatgpt-basic.html",
        articleLabel: "使い方を詳しく見る"
    },
    claude: {
        typeName: "文章じっくりタイプ",
        title: "Claude（クロード）",
        emoji: "✍️",
        matchReason: "あなたにぴったりなのは、ていねいで自然な日本語が得意なAI「Claude」。まるで優秀な秘書のように、手紙・挨拶文・ブログなどの文章を、あなたの考えに寄り添って美しく整えてくれます。",
        freeStuff: [
            "自然な日本語での文章作成・書き直し",
            "長い文書やPDFを読み込んでの要約・相談",
            "考えごとの整理（壁打ち相手）"
        ],
        firstSteps: [
            "claude.ai を開いて、Googleアカウントなどで登録する",
            "「親戚への暑中見舞いの文面を、やわらかい言葉で書いて」と頼んでみる",
            "出てきた文章に「もう少し短く」「もっと丁寧に」と注文をつけてみる"
        ],
        url: "https://claude.ai/",
        articleUrl: "articles/claude-basic.html",
        articleLabel: "使い方を詳しく見る"
    },
    gemini: {
        typeName: "スマホで気軽タイプ",
        title: "Gemini（ジェミニ）",
        emoji: "📱",
        matchReason: "あなたにぴったりなのは、Googleが作ったAI「Gemini」。無料で使える範囲が広く、スマホとの相性が抜群です。GmailやGoogleカレンダーとつながるので、ふだんの生活にそのまま溶け込みます。",
        freeStuff: [
            "調べ物・文章作成・画像づくり（無料枠が広め）",
            "スマホに話しかけての音声会話",
            "Gmail・カレンダーなどGoogleサービスとの連携"
        ],
        firstSteps: [
            "スマホに「Gemini」の公式アプリを入れる（Androidなら最初から入っていることも）",
            "「今週末、雨でも楽しめるお出かけ先を教えて」と話しかけてみる",
            "写真を撮って「これは何の花？」と聞いてみる"
        ],
        url: "https://gemini.google.com/",
        articleUrl: "articles/prompt-engineering-basic.html",
        articleLabel: "上手な頼み方を学ぶ"
    },
    notebooklm: {
        typeName: "資料マスタータイプ",
        title: "NotebookLM（ノートブックエルエム）",
        emoji: "📚",
        matchReason: "あなたにぴったりなのは、Googleの資料整理AI「NotebookLM」。PDFや資料を渡すと、その内容だけをもとに答えてくれるので「もっともらしい嘘」が少なく安心。資料をラジオ番組のような音声解説に変える機能は感動ものです。",
        freeStuff: [
            "PDF・Webページ・メモを読み込んで要約",
            "資料の内容についての質問・回答",
            "資料を「音声のおしゃべり解説」に変換（日本語対応）"
        ],
        firstSteps: [
            "notebooklm.google.com を開き、Googleアカウントで入る",
            "手元のPDF（説明書や役所の書類など）を1つアップロードしてみる",
            "「この資料の大事な点を3つ教えて」と質問してみる"
        ],
        url: "https://notebooklm.google.com/",
        articleUrl: "articles/prompt-engineering-basic.html",
        articleLabel: "上手な頼み方を学ぶ"
    },
    perplexity: {
        typeName: "調べ物探偵タイプ",
        title: "Perplexity（パープレキシティ）",
        emoji: "🔍",
        matchReason: "あなたにぴったりなのは、調べ物専門のAI「Perplexity」。ふつうのAIと違い、答えに「出どころ（出典）」が必ず付くので、情報の正しさを自分の目で確かめられます。検索の代わりに使える、頼れる探偵です。",
        freeStuff: [
            "最新ニュースも含めた調べ物（出典リンク付き）",
            "「AとBはどう違う？」といった比較の質問",
            "スマホアプリでの音声質問"
        ],
        firstSteps: [
            "perplexity.ai を開く（登録なしでも試せます）",
            "「川崎市 粗大ごみ 出し方」など、身近な調べ物を日本語で入力してみる",
            "答えの下にある出典リンクを開き、元の情報を確かめる習慣をつける"
        ],
        url: "https://www.perplexity.ai/",
        articleUrl: "articles/prompt-engineering-basic.html",
        articleLabel: "上手な頼み方を学ぶ"
    },
    midjourney: {
        typeName: "アート職人タイプ",
        title: "Midjourney（ミッドジャーニー）",
        emoji: "🎨",
        matchReason: "あなたにぴったりなのは、画像づくり専門のAI「Midjourney」。言葉で伝えるだけで、プロ顔負けの美しい絵や写真が作れる「魔法の絵筆」です。有料（月10ドル〜）ですが、絵の品質は別格です。",
        freeStuff: [
            "※Midjourney自体は有料です。まず無料で試すなら…",
            "ChatGPTやGeminiの無料画像づくりで練習",
            "気に入ったら本格派のMidjourneyへステップアップ"
        ],
        firstSteps: [
            "まずはChatGPTかGeminiで「桜と富士山の水彩画を描いて」と無料で体験",
            "もっと綺麗な絵が欲しくなったら midjourney.com に登録（月10ドル〜）",
            "「和風、水彩、やさしい色合い」のように、好みを言葉で足していく"
        ],
        url: "https://www.midjourney.com/",
        articleUrl: "articles/midjourney-guide.html",
        articleLabel: "使い方を詳しく見る"
    },
    antigravity: {
        typeName: "おまかせ執事タイプ",
        title: "Antigravity（アンチグラビティ）",
        emoji: "🤖",
        matchReason: "あなたにぴったりなのは、Googleの自律型AI「Antigravity」。指示すると、AIが自分で考えながらパソコン上の作業を進めてくれる「未来の執事」です。少し上級者向けですが、使いこなせれば作業時間が大きく変わります。",
        freeStuff: [
            "作業の計画づくりから実行までをAIにおまかせ",
            "面倒なパソコン作業の自動化",
            "簡単なアプリやツールづくり"
        ],
        firstSteps: [
            "antigravity.google からパソコンにインストールする",
            "まずは「フォルダの中のファイルを日付順に整理して」など簡単な作業を頼む",
            "AIの動きを見ながら、少しずつ大きな仕事を任せていく"
        ],
        url: "https://antigravity.google/",
        articleUrl: "articles/antigravity-guide.html",
        articleLabel: "使い方を詳しく見る"
    }
};

// ---- ここから動きの部分 ----

let currentQuestionIndex = 0;
let answerHistory = []; // 選んだ選択肢の記録（もどる用）

function createEmptyScores() {
    const s = {};
    TOOLS.forEach(t => { s[t] = 0; });
    return s;
}

function calcScores() {
    const scores = createEmptyScores();
    answerHistory.forEach((optIndex, qIndex) => {
        const opt = QUESTIONS[qIndex].options[optIndex];
        Object.entries(opt.scores).forEach(([tool, pts]) => {
            scores[tool] += pts;
        });
    });
    return scores;
}

function getRanking() {
    const scores = calcScores();
    return [...TOOLS].sort((a, b) => {
        if (scores[b] !== scores[a]) return scores[b] - scores[a];
        return TIE_PRIORITY.indexOf(a) - TIE_PRIORITY.indexOf(b);
    });
}

function renderQuiz() {
    const container = document.getElementById("quizContainer");
    if (!container) return;

    const q = QUESTIONS[currentQuestionIndex];
    const total = QUESTIONS.length;
    const percent = Math.round((currentQuestionIndex / total) * 100);

    let html = `
        <div class="quiz-progress">
            <span class="quiz-progress-text">質問 ${currentQuestionIndex + 1} / ${total}</span>
            <div class="quiz-progress-track"><div class="quiz-progress-fill" style="width:${percent}%"></div></div>
        </div>
        <h2 class="quiz-question">${q.question}</h2>
        <div class="quiz-options">`;

    q.options.forEach((opt, index) => {
        html += `<button class="quiz-btn" style="animation-delay:${index * 0.08}s" onclick="handleAnswer(${index})">${opt.text}</button>`;
    });

    html += `</div>`;

    if (currentQuestionIndex > 0) {
        html += `<button class="quiz-back" onclick="goBack()">← ひとつ前にもどる</button>`;
    }

    container.innerHTML = html;
}

function handleAnswer(optionIndex) {
    answerHistory.push(optionIndex);
    if (currentQuestionIndex < QUESTIONS.length - 1) {
        currentQuestionIndex++;
        renderQuiz();
    } else {
        showResult();
    }
}

function goBack() {
    if (currentQuestionIndex === 0) return;
    currentQuestionIndex--;
    answerHistory.pop();
    renderQuiz();
}

function showResult() {
    const container = document.getElementById("quizContainer");
    const ranking = getRanking();
    const best = RESULTS[ranking[0]];
    const second = RESULTS[ranking[1]];

    const freeItems = best.freeStuff.map(item => `<li>${item}</li>`).join("");
    const stepItems = best.firstSteps.map((item, i) =>
        `<li><span class="step-num">${i + 1}</span><span>${item}</span></li>`
    ).join("");

    const html = `
        <div class="quiz-result animate-in">
            <p class="result-label">あなたは…</p>
            <p class="result-type">${best.emoji} ${best.typeName}</p>
            <p class="result-label">おすすめのAIは</p>
            <h2 class="result-title">${best.title}</h2>

            <div class="result-match">
                <strong>診断結果：</strong>
                <p>${best.matchReason}</p>
            </div>

            <div class="result-box">
                <h3>🆓 無料でできること</h3>
                <ul class="free-list">${freeItems}</ul>
            </div>

            <div class="result-box">
                <h3>👣 最初の一歩（この順番でどうぞ）</h3>
                <ol class="step-list">${stepItems}</ol>
            </div>

            <div class="result-actions">
                <a href="${best.url}" target="_blank" rel="noopener" class="cta-btn primary">公式サイトを開く <span>🚀</span></a>
                <a href="${best.articleUrl}" class="cta-btn secondary">${best.articleLabel}</a>
            </div>

            <div class="second-choice">
                <p>🥈 <strong>2番目に合いそうなAI：</strong>${second.title.split("（")[0]}（${second.typeName}）</p>
            </div>

            <button class="reset-link" onclick="resetQuiz()">もう一度診断する</button>
        </div>
    `;

    container.innerHTML = html;
    container.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetQuiz() {
    currentQuestionIndex = 0;
    answerHistory = [];
    renderQuiz();
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("quizContainer")) {
        renderQuiz();
    }
});
