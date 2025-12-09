/*******************************
 * STRUCTURE DE L’ARBRE
 *******************************/
const tree = {
    question: "Quel est votre profil ?",
    answers: [
        { text: "Je suis à la recherche d'un emploi", next: "emploi_1" },
        { text: "Je suis demandeur d'asile ou j'ai un titre de séjour", next: "asile_1" },
        { text: "Je suis au collège, lycée ou études supérieures", next: "etudiant_1" },
        { text: "Je suis en formation", next: "etudiant_1" },
        { text: "Je suis à la retraite", next: "retraite_1" }
    ]
};

// Profil emploi
const emploi_1 = {
    question: "À quelle fréquence souhaiteriez-vous utiliser l'ordinateur ?",
    answers: [
        {
            text: "Une fois par mois",
            next: "emploi_2"
        },
        {
            text: "Au moins une fois par semaine",
            next: "emploi_2"
        },
        {
            text: "Tous les jours",
            next: "emploi_2"
        }
    ]
};

const emploi_2 = {
    question: "Que souhaiteriez-vous faire sur cet ordinateur ?",
    answers: [
        {
            text: "Répondre à des mails de manière occasionnelle, consultez des offres",
            next: "occasionnel"
        },
        {
            text: "Répondre à des mails de manière régulière, consultez des offres, rédiger des CV, lettres de motivation et documents",
            next: "courant"
        },
        {
            text: "Rechercher de manière active une formation, demandant l'utilisation régulière et intensive d'un outil informatique pour son intégration",
            next: "avance"
        }
    ]
};

// Profil asile
const asile_1 = {
    question: "Que souhaiteriez-vous faire sur cet ordinateur ?",
    answers: [
        {
            text: "Démarches administratives, mails et Internet principalement",
            next: "occasionnel"
        },
        {
            text: "Démarches administratives, mails, Internet, bureautique et visioconférence",
            next: "courant"
        }
    ]
};

// Profil étudiant/formation
const etudiant_1 = {
    question: "Que souhaiteriez-vous faire sur cet ordinateur ?",
    answers: [
        {
            text: "Internet, administratif et bureautique",
            next: "etudiant_2"
        },
        {
            text: "Logiciels métier et poussés, bureautique avancée",
            next: "etudiant_2"
        }
    ]
};

const etudiant_2 = {
    question: "Souhaitez-vous garder l'ordinateur le plus longtemps possible ?",
    answers: [
        {
            text: "Je souhaite en changer avec mes études supérieures ou plus tard",
            next: "courant"
        }
        {
            text: "Je souhaite le garder le plus longtemps possible",
            next: "avance"
        }
    ]
};

// Profil retraité
const retraite_1 = {
    question: "Que souhaiteriez-vous faire dessus ?",
    answers: [
        {
            text: "Administratif, mails et navigation Internet principalement, avec un peu de bureautique légère",
            next: "occasionnel"
        },
        {
            text: "Internet, mails, administratif et bureautique de manière régulière ou quotidienne",
            next: "courant"
        }
    ]
};

/*********************************
 * RÉSULTATS FINALS
 *********************************/
const results = {
    "occasionnel": "🟦 Usage occasionnel (70 €) :<br><br>Un ordinateur simple, pour naviguer sur Internet ou consulter ses mails ponctuellement. <br><br>💡Adapté pour les personnes à la retraite notamment, ainsi que les personne n'utilisant leur ordinateur que ponctuellement.",
    "courant": "🟩 Usage courant (110 €) :<br><br>Un PC polyvalent convenant à la bureautique, à Internet et à un usage fréquent. <br><br>💡Idéal pour les personnes utilisant un ordinateur de manière régulière ou quotidienne, pour tout type d'usage.",
    "avance": "🟥 Usage avancé (150 €) :<br><br>Une machine plus puissante adaptée aux logiciels professionnels, métiers ou lourds. <br><br>💡Adaptée aux personnes en études, en formation, ou aux personnes utilisant des logiciels métiers plus gourmands en ressources."
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
    if (node === "asile_1") return asile_1;
    if (node === "asile_2") return asile_2;
    if (node === "emploi_1") return emploi_1;
    if (node === "emploi_2") return emploi_2;
    if (node === "retraite_1") return retraite_1;
    if (node === "etudiant_1") return etudiant_1;
    if (node === "etudiant_2") return etudiant_2;
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
        questionEl.innerHTML = "Recommandation";
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
