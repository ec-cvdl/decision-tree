/*******************************
 * STRUCTURE DE L’ARBRE
 *******************************/
const tree = {
    question: "Quel est votre profil ?",
    answers: [
        { text: "Je suis à la recherche d'un emploi", next: "freq" },
        { text: "Je suis demandeur d'asile", next: "freq" },
        { text: "Je suis au collège, lycée ou études supérieures", next: "freq" },
        { text: "Je suis en formation", next: "freq" },
        { text: "Je suis à la retraite", next: "freq" }
    ]
};

// Sous-arbre 2 — fréquence d’utilisation
const freq = {
    question: "À quelle fréquence souhaiteriez-vous utiliser l'ordinateur ?",
    answers: [
        {
            text: "Une fois par mois",
            next: "occasionnel"
        },
        {
            text: "Au moins une fois par semaine",
            next: "usage"
        },
        {
            text: "Tous les jours",
            next: "usage"
        }
    ]
};

// Sous-arbre 3 — type d’utilisation
const usage = {
    question: "Que souhaiteriez-vous faire dessus ?",
    answers: [
        {
            text: "Mails et navigation Internet principalement, avec un peu de bureautique légère",
            next: "courant"
        },
        {
            text: "Internet, administratif et bureautique",
            next: "courant"
        },
        {
            text: "Logiciels métier et poussés, bureautique avancée",
            next: "avance"
        }
    ]
};

/*********************************
 * RÉSULTATS FINALS
 *********************************/
const results = {
    "occasionnel": "🟦 Usage occasionnel (70 €) :<br><br>Un ordinateur simple, pour naviguer sur Internet ou consulter ses mails ponctuellement. Adapté pour les personnes à la retraite notamment, ainsi que les personne n'utilisant leur ordinateur que ponctuellement.",
    "courant": "🟩 Usage courant (110 €) :<br><br>Un PC polyvalent convenant à la bureautique, à Internet et à un usage fréquent. Idéal pour les personnes utilisant un ordinateur de manière régulière ou quotidienne, pour tout type d'usage.",
    "avance": "🟥 Usage avancé (150 €) :<br><br>Une machine plus puissante adaptée aux logiciels professionnels, métiers ou lourds. Adaptée aux personnes en études, en formation, ou aux personnes utilisant des logiciels métiers plus gourmands en ressources."
};

/*********************************
 * APP STATE
 *********************************/
let steps = [];           
let answersLog = [];

/*********************************
 * SELECTEURS
 *********************************/
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const progressBar = document.getElementById("progress-bar");
const restartBtn = document.getElementById("restart");

/*********************************
 * ROUTAGE DES NŒUDS
 *********************************/
function resolveNode(node) {
    if (node === "freq") return freq;
    if (node === "usage") return usage;
    return node;
}

/*********************************
 * FONCTION D'AFFICHAGE
 *********************************/
function render(node) {

    node = resolveNode(node);

    const totalQuestions = 3;
    const progress = Math.min(100, Math.round((steps.length / totalQuestions) * 100));
    progressBar.style.width = progress + "%";

    // Résultat final ?
    if (typeof node === "string") {
        questionEl.innerHTML = "Résultat final";
        answersEl.innerHTML = `
            <p>${results[node]}</p>

        `;
        restartBtn.classList.remove("hidden");
        return;
    }

    questionEl.innerHTML = node.question;
    answersEl.innerHTML = "";

    node.answers.forEach(answer => {
        const btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = answer.text;

        btn.onclick = () => {
            steps.push("step");
            answersLog.push(answer.text);
            render(answer.next);
        };

        answersEl.appendChild(btn);
    });
}

function restart() {
    steps = [];
    answersLog = [];
    restartBtn.classList.add("hidden");
    render(tree);
}
restartBtn.onclick = restart;

/*********************************
 * EXPORT CSV
 *********************************/
function exportData() {
    const csv = answersLog.join(",");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "reponses_pc.csv";
    a.click();
}

/*********************************
 * LANCER L’APP
 *********************************/
render(tree);
