"use strict";

const formulaireAgent = document.getElementById("formulaire-agent");
const nomInput = document.getElementById("Input-name");
const roleInput = document.getElementById("Input-role");
const imageInput = document.getElementById("Input-image");
const emailInput = document.getElementById("Input-email");
const telephoneInput = document.getElementById("Input-telephone");
const ajouterAgentBtn = document.getElementById("ajouter-agent");
const fondFormulaire = document.getElementById("FormOf_ADD_worker");
const listeAgentsContainer = document.getElementById("liste-agents");

const nomError = document.getElementById("errorNameMessage");
const roleError = document.getElementById("errorRoleMessage");
const imageError = document.getElementById("errorURLMessage");
const emailError = document.getElementById("errorEmailMessage");
const telephoneError = document.getElementById("errorTeleMessage");

const nomRegex = /^[a-zA-ZÀ-ÿ]+(\s[a-zA-ZÀ-ÿ]+)*$/; 
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
const telephoneRegex = /^0[1-9](\s?\d{2}){4}$/; 
const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/; 

function sauvegarderAgents(agents) {
    localStorage.setItem('agents', JSON.stringify(agents));
}

function chargerAgents() {
    const agents = localStorage.getItem('agents');
    return agents ? JSON.parse(agents) : [];
}

function afficherAgents() {
    const agents = chargerAgents();
    listeAgentsContainer.innerHTML = '';

    if (agents.length === 0) {
        listeAgentsContainer.innerHTML = '<div class="no-agents">Aucun agent ajouté</div>';
        return;
    }

    agents.forEach((agent, index) => {
        const agentCard = document.createElement('div');
        agentCard.className = 'agent-card';
        agentCard.innerHTML = `
            <img src="${agent.image}" alt="${agent.nom}" class="agent-image" 
                 onerror="this.src='https://via.placeholder.com/60x60/3498db/ffffff?text=?'">
            <div class="agent-info">
                <div class="agent-nom">${agent.nom}</div>
                <div class="agent-role">${agent.role}</div>
                <div class="agent-contact">${agent.email} • ${agent.telephone}</div>
            </div>
            <button class="supprimer-agent" data-index="${index}">×</button>
        `;
        listeAgentsContainer.appendChild(agentCard);
    });

    document.querySelectorAll('.supprimer-agent').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            supprimerAgent(index);
        });
    });
}

function supprimerAgent(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
        const agents = chargerAgents();
        agents.splice(index, 1);
        sauvegarderAgents(agents);
        afficherAgents();
    }
}

function validateInput(input, regex, errorElement, errorMessage) {
    const value = input.value.trim();
    if (!value || !regex.test(value)) {
        input.classList.add("invalid");
        errorElement.textContent = errorMessage;
        return false;
    } else {
        input.classList.remove("invalid");
        errorElement.textContent = "";
        return true;
    }
}

function validateRole() {
    if (!roleInput.value) {
        roleInput.classList.add("invalid");
        roleError.textContent = "Veuillez choisir un rôle";
        return false;
    } else {
        roleInput.classList.remove("invalid");
        roleError.textContent = "";
        return true;
    }
}

nomInput.addEventListener("input", () => {
    validateInput(nomInput, nomRegex, nomError, "Nom invalide - uniquement des lettres");
});

emailInput.addEventListener("input", () => {
    validateInput(emailInput, emailRegex, emailError, "Format d'email invalide");
});

telephoneInput.addEventListener("input", () => {
    validateInput(telephoneInput, telephoneRegex, telephoneError, "Numéro de téléphone invalide (ex: 0123456789)");
});

imageInput.addEventListener("input", () => {
    validateInput(imageInput, urlRegex, imageError, "URL d'image invalide");
});

roleInput.addEventListener("change", validateRole);

ajouterAgentBtn.addEventListener("click", function() {
    fondFormulaire.classList.remove("hidden");
});


document.getElementById("boutonAnnuler").addEventListener("click", function() {
    fondFormulaire.classList.add("hidden");
    resetForm();
});


fondFormulaire.addEventListener("click", function(e) {
    if (e.target === fondFormulaire) {
        fondFormulaire.classList.add("hidden");
        resetForm();
    }
});


let experienceCount = 1;

function ajouterExperience() {
    experienceCount++;
    const nouveauBloc = document.createElement("div");
    nouveauBloc.className = "experience-block";
    nouveauBloc.innerHTML = `
        <div class="input-block">
            <label for="exp-title-${experienceCount}">Le nom d'expérience</label>
            <input id="exp-title-${experienceCount}" type="text" class="exp-title">
            <div class="error-message"></div>
        </div>
        <div class="date-pair">
            <div class="input-block date-input-group">
                <label for="exp-start-${experienceCount}">Début</label>
                <input id="exp-start-${experienceCount}" type="date" class="exp-start-date">
            </div>
            <div class="input-block date-input-group">
                <label for="exp-end-${experienceCount}">Fin</label>
                <input id="exp-end-${experienceCount}" type="date" class="exp-end-date">
            </div>
        </div>
        <button type="button" class="supprimer-experience">Supprimer</button>
    `;
    
    document.getElementById("experiencesContainer").appendChild(nouveauBloc);
    

    nouveauBloc.querySelector(".supprimer-experience").addEventListener("click", function() {
        if (document.querySelectorAll(".experience-block").length > 1) {
            nouveauBloc.remove();
        }
    });
}

function validerExperiences() {
    const blocsExperience = document.querySelectorAll(".experience-block");
    let isValid = true;
    
    blocsExperience.forEach((bloc) => {
        const titre = bloc.querySelector(".exp-title");
        const dateDebut = bloc.querySelector(".exp-start-date");
        const dateFin = bloc.querySelector(".exp-end-date");
        const erreurTitre = bloc.querySelector(".error-message");
        

        if (!titre.value.trim()) {
            titre.classList.add("invalid");
            erreurTitre.textContent = "Le nom de l'expérience est requis";
            isValid = false;
        } else {
            titre.classList.remove("invalid");
            erreurTitre.textContent = "";
        }
        

        if (dateDebut.value && dateFin.value) {
            if (new Date(dateDebut.value) > new Date(dateFin.value)) {
                dateDebut.classList.add("invalid");
                dateFin.classList.add("invalid");
                isValid = false;
            } else {
                dateDebut.classList.remove("invalid");
                dateFin.classList.remove("invalid");
            }
        }
    });
    
    return isValid;
}


imageInput.addEventListener("input", function() {
    const preview = document.querySelector(".imageWorker");
    if (this.value) {
        preview.innerHTML = `<img src="${this.value}" alt="Preview" style="max-width: 100px; max-height: 100px; border-radius: 5px; margin-top: 10px;">`;
    } else {
        preview.innerHTML = "";
    }
});


function resetForm() {
    formulaireAgent.reset();
    document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
    document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
    document.querySelector(".imageWorker").innerHTML = "";
    

    const conteneurExperiences = document.getElementById("experiencesContainer");
    const blocsExperience = conteneurExperiences.querySelectorAll(".experience-block");
    for (let i = 1; i < blocsExperience.length; i++) {
        blocsExperience[i].remove();
    }
    experienceCount = 1;
}


formulaireAgent.addEventListener("submit", function(event) {
    event.preventDefault();
    
    
    const isNomValid = validateInput(nomInput, nomRegex, nomError, "Nom invalide - uniquement des lettres");
    const isEmailValid = validateInput(emailInput, emailRegex, emailError, "Format d'email invalide");
    const isTelephoneValid = validateInput(telephoneInput, telephoneRegex, telephoneError, "Numéro de téléphone invalide (ex: 0123456789)");
    const isImageValid = validateInput(imageInput, urlRegex, imageError, "URL d'image invalide");
    const isRoleValid = validateRole();
    const isExperiencesValid = validerExperiences();
    
    if (isNomValid && isEmailValid && isTelephoneValid && isImageValid && isRoleValid && isExperiencesValid) {

        const agent = {
            nom: nomInput.value.trim(),
            role: roleInput.value,
            image: imageInput.value.trim(),
            email: emailInput.value.trim(),
            telephone: telephoneInput.value.trim(),
            experiences: []
        };
        

        document.querySelectorAll(".experience-block").forEach(bloc => {
            const titre = bloc.querySelector(".exp-title").value.trim();
            const dateDebut = bloc.querySelector(".exp-start-date").value;
            const dateFin = bloc.querySelector(".exp-end-date").value;
            
            if (titre) {
                agent.experiences.push({
                    titre: titre,
                    dateDebut: dateDebut,
                    dateFin: dateFin
                });
            }
        });
        

        const agents = chargerAgents();
        agents.push(agent);
        sauvegarderAgents(agents);
        
        console.log("Agent créé:", agent);
        alert("Agent ajouté avec succès !");
        

        afficherAgents();
        fondFormulaire.classList.add("hidden");
        resetForm();
    } else {
        alert("Veuillez corriger les erreurs dans le formulaire");
    }
});


document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("ajouterExperienceBtn").addEventListener("click", ajouterExperience);
    
    document.querySelector(".supprimer-experience").addEventListener("click", function() {
        console.log("Le premier bloc d'expérience ne peut pas être supprimé");
    });
    
    afficherAgents();
});