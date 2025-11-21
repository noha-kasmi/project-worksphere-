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

const sallesConfig = {
    'room1': { 
        nom: 'Salle de conférence', 
        rolesAutorises: ['Manager', 'Nettoyage', 'Développeur', 'Commercial'],
        capacite: 10,
        employes: []
    },
    'room2': { 
        nom: 'Réception', 
        rolesAutorises: ['Receptionnistes', 'Manager', 'Nettoyage'],
        capacite: 3,
        employes: [],
        requis: true
    },
    'room3': { 
        nom: 'Salle des serveurs', 
        rolesAutorises: ['Techniciens_IT', 'Manager'],
        capacite: 2,
        employes: [],
        requis: true
    },
    'room4': { 
        nom: 'Salle de sécurité', 
        rolesAutorises: ['sécurité', 'Manager', 'Nettoyage'],
        capacite: 4,
        employes: [],
        requis: true
    },
    'room5': { 
        nom: 'Salle du personnel', 
        rolesAutorises: ['Manager', 'Nettoyage', 'Développeur', 'Commercial', 'Receptionnistes', 'Techniciens_IT', 'sécurité'],
        capacite: 8,
        employes: []
    },
    'room6': { 
        nom: 'Salle d\'archives', 
        rolesAutorises: ['Manager', 'Développeur', 'Commercial'],
        capacite: 2,
        employes: [],
        requis: true
    }
};

const roleMapping = {
    'Receptionnistes': 'Réceptionniste',
    'Techniciens_IT': 'Technicien IT',
    'sécurité': 'Agent de sécurité',
    'Manager': 'Manager',
    'Nettoyage': 'Nettoyage'
};

function initialiserSalles() {
    const agents = chargerAgents();
    
    Object.keys(sallesConfig).forEach(salleId => {
        sallesConfig[salleId].employes = [];
    });
    
    agents.forEach(agent => {
        if (agent.salle) {
            if (sallesConfig[agent.salle] && sallesConfig[agent.salle].employes.length < sallesConfig[agent.salle].capacite) {
                sallesConfig[agent.salle].employes.push(agent);
            }
        }
    });
    
    afficherEmployesDansSalles();
    verifierSallesRequises();
}

function afficherEmployesDansSalles() {
    Object.keys(sallesConfig).forEach(salleId => {
        const salle = document.querySelector(`.${salleId}`);
        if (salle) {
            salle.querySelectorAll('.employe-dans-salle').forEach(el => el.remove());
            
            sallesConfig[salleId].employes.forEach(employe => {
                const badgeEmploye = creerBadgeEmploye(employe);
                salle.appendChild(badgeEmploye);
            });
            
            const boutonAdd = salle.querySelector('.aj-room');
            if (boutonAdd) {
                const compteur = salle.querySelector('.compteur-salle') || document.createElement('span');
                compteur.className = 'compteur-salle';
                compteur.textContent = `(${sallesConfig[salleId].employes.length}/${sallesConfig[salleId].capacite})`;
                compteur.style.fontSize = '12px';
                compteur.style.marginLeft = '5px';
                compteur.style.color = '#666';
                
                if (!salle.querySelector('.compteur-salle')) {
                    boutonAdd.parentNode.insertBefore(compteur, boutonAdd.nextSibling);
                }
            }
        }
    });
}

function creerBadgeEmploye(employe) {
    const badge = document.createElement('div');
    badge.className = 'employe-dans-salle';
    badge.innerHTML = `
        <img src="${employe.image}" alt="${employe.nom}" 
             onerror="this.src='https://via.placeholder.com/30x30/3498db/ffffff?text=?'">
        <span>${employe.nom.split(' ')[0]}</span>
        <button class="retirer-salle" data-id="${employe.id}">×</button>
    `;
    
    badge.style.cssText = `
        display: flex;
        align-items: center;
        gap: 5px;
        background: white;
        padding: 5px;
        border-radius: 15px;
        margin: 2px;
        font-size: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        max-width: 120px;
    `;
    
    badge.querySelector('img').style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        object-fit: cover;
    `;
    
    badge.querySelector('.retirer-salle').style.cssText = `
        background: #e74c3c;
        color: white;
        border: none;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        font-size: 10px;
        cursor: pointer;
        margin-left: auto;
    `;
    
    badge.querySelector('.retirer-salle').addEventListener('click', (e) => {
        e.stopPropagation();
        retirerEmployeDeSalle(employe.id);
    });
    
    badge.addEventListener('click', () => {
        afficherProfilEmploye(employe);
    });
    
    return badge;
}

function retirerEmployeDeSalle(employeId) {
    const agents = chargerAgents();
    const agentIndex = agents.findIndex(a => a.id === employeId);
    
    if (agentIndex !== -1) {
        agents[agentIndex].salle = null;
        sauvegarderAgents(agents);
        initialiserSalles();
        afficherAgents();
    }
}

function verifierSallesRequises() {
    Object.keys(sallesConfig).forEach(salleId => {
        const salle = sallesConfig[salleId];
        if (salle.requis && salle.employes.length === 0) {
            const elementSalle = document.querySelector(`.${salleId}`);
            if (elementSalle) {
                elementSalle.style.backgroundColor = 'rgba(231, 76, 60, 0.3)';
                elementSalle.style.border = '2px solid #e74c3c';
            }
        }
    });
}


function initialiserBoutonsSalles() {
    document.querySelectorAll('.aj-room').forEach((bouton, index) => {
        const salleId = `room${index + 1}`;
        
        bouton.addEventListener('click', (e) => {
            e.stopPropagation();
            ouvrirModalAffectation(salleId);
        });
    });
}

function ouvrirModalAffectation(salleId) {
    const salle = sallesConfig[salleId];
    const agentsDisponibles = chargerAgents().filter(agent => 
        !agent.salle && 
        salle.rolesAutorises.includes(agent.role) &&
        salle.employes.length < salle.capacite
    );
    
    if (agentsDisponibles.length === 0) {
        alert(`Aucun agent disponible pour la ${salle.nom}. Vérifiez les restrictions de rôle ou la capacité.`);
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'fond-formulaire';
    modal.innerHTML = `
        <div class="conteneur-modal">
            <h3>Affecter un agent à ${salle.nom}</h3>
            <div class="liste-agents-modal">
                ${agentsDisponibles.map(agent => `
                    <div class="agent-selection" data-id="${agent.id}">
                        <img src="${agent.image}" alt="${agent.nom}">
                        <div>
                            <strong>${agent.nom}</strong>
                            <div>${agent.role}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="boutons-formulaire">
                <button id="annulerAffectation">Annuler</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.liste-agents-modal').style.cssText = `
        max-height: 300px;
        overflow-y: auto;
        margin: 20px 0;
    `;
    
    modal.querySelectorAll('.agent-selection').forEach(element => {
        element.style.cssText = `
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 10px;
            border: 1px solid #ecf0f1;
            border-radius: 8px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: background-color 0.2s;
        `;
        
        element.querySelector('img').style.cssText = `
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
        `;
        
        element.addEventListener('mouseenter', () => {
            element.style.backgroundColor = '#f8f9fa';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.backgroundColor = 'white';
        });
        
        element.addEventListener('click', () => {
            const agentId = element.getAttribute('data-id');
            affecterEmployeASalle(agentId, salleId);
            document.body.removeChild(modal);
        });
    });
    
    modal.querySelector('#annulerAffectation').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}


function affecterEmployeASalle(employeId, salleId) {
    const agents = chargerAgents();
    const agentIndex = agents.findIndex(a => a.id === employeId);
    
    if (agentIndex !== -1) {
        agents[agentIndex].salle = salleId;
        sauvegarderAgents(agents);
        initialiserSalles();
        afficherAgents();
    }
}


function afficherProfilEmploye(employe) {
    const modal = document.createElement('div');
    modal.className = 'fond-formulaire';
    modal.innerHTML = `
        <div class="conteneur-modal">
            <h3>Profil de ${employe.nom}</h3>
            <div class="profil-employe">
                <img src="${employe.image}" alt="${employe.nom}" class="photo-profil">
                <div class="info-profil">
                    <p><strong>Rôle:</strong> ${employe.role}</p>
                    <p><strong>Email:</strong> ${employe.email}</p>
                    <p><strong>Téléphone:</strong> ${employe.telephone}</p>
                    <p><strong>Localisation:</strong> ${employe.salle ? sallesConfig[employe.salle].nom : 'Non assigné'}</p>
                </div>
            </div>
            ${employe.experiences && employe.experiences.length > 0 ? `
                <div class="experiences-profil">
                    <h4>Expériences professionnelles</h4>
                    ${employe.experiences.map(exp => `
                        <div class="experience-item">
                            <strong>${exp.titre}</strong>
                            ${exp.dateDebut ? `<div>${exp.dateDebut} - ${exp.dateFin || 'En cours'}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            <div class="boutons-formulaire">
                <button id="fermerProfil">Fermer</button>
                ${!employe.salle ? `<button id="affecterProfil">Affecter à une salle</button>` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
   
    modal.querySelector('.profil-employe').style.cssText = `
        display: flex;
        gap: 20px;
        align-items: flex-start;
        margin: 20px 0;
    `;
    
    modal.querySelector('.photo-profil').style.cssText = `
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid #3498db;
    `;
    
    modal.querySelector('.info-profil').style.cssText = `
        flex: 1;
    `;
    
    modal.querySelector('.experiences-profil').style.cssText = `
        margin: 20px 0;
    `;
    
    modal.querySelector('.experience-item').style.cssText = `
        background: #f8f9fa;
        padding: 10px;
        border-radius: 5px;
        margin: 5px 0;
    `;
 
    modal.querySelector('#fermerProfil').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    if (modal.querySelector('#affecterProfil')) {
        modal.querySelector('#affecterProfil').addEventListener('click', () => {
            document.body.removeChild(modal);
            ouvrirModalAffectationGenerale(employe.id);
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function afficherAgents() {
    const agents = chargerAgents();
    const container = document.getElementById('liste-agents');
    
    if (agents.length === 0) {
        container.innerHTML = '<div class="no-agents">Aucun agent ajouté</div>';
        return;
    }
    
    container.innerHTML = agents.map((agent, index) => {
        return `
            <div class="agent-card">
                <img src="${agent.image}" alt="${agent.nom}" class="agent-image"
                     onerror="this.src='https://via.placeholder.com/60x60/3498db/ffffff?text=?'">
                <div class="agent-info">
                    <div class="agent-nom">${agent.nom}</div>
                    <div class="agent-role">${agent.role}</div>
                    <div class="agent-contact">${agent.email} • ${agent.telephone}</div>
                    ${agent.salle ? `<div class="agent-salle"> ${sallesConfig[agent.salle].nom}</div>` : ''}
                </div>
                <div class="agent-actions">
                    <button class="affecter-agent" data-id="${agent.id}"></button>
                    <button class="supprimer-agent" data-index="${index}">×</button>
                </div>
            </div>
        `;
    }).join('');
    document.querySelectorAll('.affecter-agent').forEach(btn => {
        btn.addEventListener('click', function() {
            const agentId = this.getAttribute('data-id');
            ouvrirModalAffectationGenerale(agentId);
        });
    });

    document.querySelectorAll('.supprimer-agent').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            supprimerAgent(index);
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const agents = chargerAgents();
    agents.forEach((agent, index) => {
        if (!agent.id) {
            agent.id = 'agent_' + Date.now() + '_' + index;
        }
    });
    sauvegarderAgents(agents);
    
    ajouterStylesSupplementaires();
    initialiserSalles();
    initialiserBoutonsSalles();
    initialiserRecherche();
    
    const btnReorganisation = document.createElement('button');
    btnReorganisation.textContent = 'Réorganisation automatique';
    btnReorganisation.style.cssText = `
        background: #9b59b6;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        margin: 10px 0;
        width: 100%;
    `;
    btnReorganisation.addEventListener('click', reorganiserAutomatiquement);
    const sideBar = document.querySelector('.side-bar');
    sideBar.appendChild(btnReorganisation);
    console.log('Application WorkSphere initialisée avec succès!');
});