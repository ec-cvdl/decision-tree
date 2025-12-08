/*******************************
 * STRUCTURE DE L’ARBRE
 *******************************/
const tree = {
    question: "À quelle fréquence souhaiteriez-vous utiliser l'ordinateur ?",
    answers: [
        {
            text: "Une fois par mois",
            next: "occasionnel"
        },
        {
            text: "Au moins une fois par semaine",
            next: {
                question: "Que souhaiteriez-vous faire dessus ?",
                answers: [
                    {
                        text: "Mail et navigation Internet principalement",
                        next: "courant"
                    },
                    {
                        text: "Internet, administratif et bureautique",
                        next: "courant"
                    },
                    {
                        text: "Logiciels métier et poussés",
                        next: "avance"
                    }
                ]
            }
        },
        {
            text: "Tous les jours",
            next: {
                question: "Que souhaiteriez-vous faire dessus ?",
                answers: [
                    {
                        text: "Mail, Internet principalement et bureautique légère",
                        next: "courant"
                    },
                    {
                        text: "Mails, Internet, administratif et bureautique",
                        next: "courant"
                    },
                    {
                        text: "Logiciels métier, bureautique exigeante",
                        next: "avance"
                    }
                ]
            }
        }
    ]
};

/*********************************
 * RÉSULTATS FINALS
 *********************************/
const results = {
    "occasionnel": "🟦 Usage occasionnel :<br><br>Un ordinateur simple, pour naviguer sur Internet, consulter ses mails occasionnellement et faire de la bureautique légère",
    "courant": "🟩 Usage courant :<br><br>Un PC polyvalent pour un usage hebdomadaire : Internet, bureautique, administratif. Parfaitement adapté à un usage quotidien",
    "avance": "🟥 Usage avancé :<br><br>Une machine plus puissante, adaptée aux logiciels lourds, métiers ou poussés."
};

/*********************************
 * APP STATE
 *********************************/
let currentNode = tree;
let steps = [];           // pour progression
let answersLog = [];      // pour export CSV

/*********************************
 * SELECTEURS
 *********************************/
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const progressBar = document.getElementById("progress-bar");
const restartBtn = document.getElementById("restart");

/*********************************
 * FONCTIONS
 *********************************/
function render(node) {

    // Progression simple basée sur le nombre de questions
    const progress = Math.min(100, Math.round((steps.length / 3) * 100));
    progressBar.style.width = progress + "%";

    // Résultat final ?
    if (typeof node === "string") {
        questionEl.innerHTML = "Résultat final";
        answersEl.innerHTML = `
            <p>${results[node]}</p>
            <button class="answer-btn" onclick="exportData()">Exporter mes réponses</button>
        `;
        restartBtn.classList.remove("hidden");
        return;
    }

    // Afficher la question
    questionEl.innerHTML = node.question;

    // Afficher les réponses
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
 * EXPORT DES RÉPONSES
 *********************************/
function exportData() {
    const csv = answersLog.join(",");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "reponses_arbre_pc.csv";
    a.click();
}

/*********************************
 * LANCER L’APP
 *********************************/
render(tree);
