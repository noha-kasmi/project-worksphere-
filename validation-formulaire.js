"use strict";

const formulaireAgent = document.querySelector("#formulaire-agent");
const nomInput = document.querySelector("#Input-name");
const roleInput = document.querySelector("#Input-role");
const imageInput = document.querySelector("#Input-image");
const emailInput = document.querySelector("#Input-email");
const telephoneInput = document.querySelector("#Input-telephone");
const ajouterAgentBtn = document.querySelector("#ajouter-agent");
const fondFormulaire = document.querySelector("#FormOf_ADD_worker");
const boutonAnnuler = document.querySelector("#boutonAnnuler");

const nomError = document.querySelector("#errorNameMessage");
const roleError = document.querySelector("#errorRoleMessage");
const imageError = document.querySelector("#errorURLMessage");
const emailError = document.querySelector("#errorEmailMessage");
const telephoneError = document.querySelector("#errorTeleMessage");

const nomRegex = /^[a-zA-ZÀ-ÿ]+(\s[a-zA-ZÀ-ÿ]+)*$/; 
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
const telephoneRegex = /^0[1-9](\s?\d{2}){4}$/; 
const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/; 

function validateInput(input, regex, errorElement, errorMessage) {
    if (!regex.test(input.value.trim())) {
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
    if (roleInput.value === "") {
        roleInput.classList.add("invalid");
        roleError.textContent = "Veuillez choisir un rôle";
        return false;
    } else {
        roleInput.classList.remove("invalid");
        roleError.textContent = "";
        return true;
    }
}

nomInput.addEventListener("input", () =>
    validateInput(nomInput, nomRegex, nomError, "Nom invalide - uniquement des lettres")
);

emailInput.addEventListener("input", () =>
    validateInput(emailInput, emailRegex, emailError, "Format d'email invalide")
);

telephoneInput.addEventListener("input", () =>
    validateInput(telephoneInput, telephoneRegex, telephoneError, "Numéro de téléphone invalide")
);

imageInput.addEventListener("input", () =>
    validateInput(imageInput, urlRegex, imageError, "URL d'image invalide")
);

roleInput.addEventListener("change", validateRole);

ajouterAgentBtn.addEventListener("click", function() {
    fondFormulaire.classList.remove("hidden");
});

boutonAnnuler.addEventListener("click", function() {
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
    
    blocsExperience.forEach((bloc, index) => {
        const titre = bloc.querySelector(".exp-title");
        const dateDebut = bloc.querySelector(".exp-start-date");
        const dateFin = bloc.querySelector(".exp-end-date");
        const erreurTitre = bloc.querySelector(".error-message");
        
        if (titre.value.trim() === "") {
            titre.classList.add("invalid");
            erreurTitre.textContent = "Le nom de l'expérience est requis";
            isValid = false;
        } else {
            titre.classList.remove("invalid");
            erreurTitre.textContent = "";
        }
        
        if (dateDebut.value && dateFin.value) {
            if (new Date(dateDebut.value) > new Date(dateFin.value)) {
                dateFin.classList.add("invalid");
                isValid = false;
            } else {
                dateFin.classList.remove("invalid");
            }
        }
    });
    
    return isValid;
}

imageInput.addEventListener("input", function() {
    const preview = document.querySelector(".imageWorker");
    if (this.value) {
        preview.innerHTML = `<img src="${this.value}" alt="Preview" style="max-width: 100px; max-height: 100px; border-radius: 5px;">`;
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
    const premiersBlocs = conteneurExperiences.querySelectorAll(".experience-block");
    for (let i = 1; i < premiersBlocs.length; i++) {
        premiersBlocs[i].remove();
    }
    experienceCount = 1;
}

formulaireAgent.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const isNomValid = validateInput(nomInput, nomRegex, nomError, "Nom invalide - uniquement des lettres");
    const isEmailValid = validateInput(emailInput, emailRegex, emailError, "Format d'email invalide");
    const isTelephoneValid = validateInput(telephoneInput, telephoneRegex, telephoneError, "Numéro de téléphone invalide");
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
            
            if (titre && dateDebut && dateFin) {
                agent.experiences.push({
                    titre: titre,
                    dateDebut: dateDebut,
                    dateFin: dateFin
                });
            }
        });
        
        console.log("Agent créé:", agent);
        alert("Agent ajouté avec succès !");
        
        fondFormulaire.classList.add("hidden");
        resetForm();
        

        
    } else {
        alert("Veuillez corriger les erreurs dans le formulaire");
    }
});

document.addEventListener("DOMContentLoaded", function() {
    if (!document.querySelector("#ajouterExperienceBtn")) {
        const boutonAjouterExp = document.createElement("button");
        boutonAjouterExp.type = "button";
        boutonAjouterExp.id = "ajouterExperienceBtn";
        boutonAjouterExp.textContent = "+ Ajouter une expérience";
        boutonAjouterExp.addEventListener("click", ajouterExperience);
        
        document.getElementById("experiencesContainer").parentNode.insertBefore(
            boutonAjouterExp, 
            document.getElementById("experiencesContainer").nextSibling
        );
    }
    
    if (!document.querySelector("#boutonAnnuler")) {
        const boutonsContainer = document.createElement("div");
        boutonsContainer.className = "boutons-formulaire";
        boutonsContainer.innerHTML = `
            <button type="submit" id="boutonSoumettre">Soumettre</button>
            <button type="button" id="boutonAnnuler">Annuler</button>
        `;
        formulaireAgent.appendChild(boutonsContainer);
        
        document.querySelector("#boutonAnnuler").addEventListener("click", function() {
            fondFormulaire.classList.add("hidden");
            resetForm();
        });
    }
});