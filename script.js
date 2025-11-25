"use strict";

// Éléments du DOM
const formulaireAgent = document.getElementById("formulaire-agent");
const nomInput = document.getElementById("input-name");
const roleInput = document.getElementById("input-role");
const imageInput = document.getElementById("input-image");
const emailInput = document.getElementById("input-email");
const telephoneInput = document.getElementById("input-telephone");
const ajouterAgentBtn = document.getElementById("ajouter-agent");
const fondFormulaire = document.getElementById("formulaire-dajoute");
const listeAgentsContainer = document.getElementById("liste-agents");

// Messages d'erreur
const nomError = document.getElementById("errornamemessage");
const roleError = document.getElementById("errorRolemessage");
const imageError = document.getElementById("errorURLmessage");
const emailError = document.getElementById("errorEmailmessage");
const telephoneError = document.getElementById("errorTelemessage");

// Regex de validation
const nomRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telephoneRegex = /^(06|07)[0-9]{8}$/;
const urlRegex = /^https?:\/\/.+\..+$/;

// Configuration des salles
const sallesConfig = {
    room1: { 
        nom: 'Réception', 
        rolesAutorises: ['receptionnistes', 'manager', 'nettoyage'], 
        capacite: 3, 
        employes: []
    },
    room2: { 
        nom: 'Bureau Manager', 
        rolesAutorises: ['manager', 'nettoyage'], 
        capacite: 1, 
        employes: []
    },
    room3: { 
        nom: 'Salle Sécurité', 
        rolesAutorises: ['securite', 'manager', 'nettoyage'], 
        capacite: 4, 
        employes: []
    },
    room4: { 
        nom: 'Techniciens IT', 
        rolesAutorises: ['techniciens_IT', 'manager'], 
        capacite: 2, 
        employes: []
    },
    room5: { 
        nom: 'Service Nettoyage', 
        rolesAutorises: ['nettoyage', 'manager'], 
        capacite: 8, 
        employes: []
    },
    room6: { 
        nom: 'Salle Réunion', 
        rolesAutorises: ['manager', 'receptionnistes', 'techniciens_IT', 'securite', 'nettoyage'], 
        capacite: 6, 
        employes: []
    }
};

// ==================== LOCALSTORAGE ====================

// Sauvegarder les agents dans le localStorage
function sauvegarderAgents(agents) {
    localStorage.setItem('agents', JSON.stringify(agents));
}

// Charger les agents depuis le localStorage
function chargerAgents() {
    const agents = localStorage.getItem('agents');
    if (agents) {
        return JSON.parse(agents);
    } else {
        return [];
    }
}

// ==================== AFFICHAGE DES AGENTS ====================

// Afficher tous les agents dans la liste
function afficherAgents() {
    const agents = chargerAgents();
    listeAgentsContainer.innerHTML = '';

    // Si aucun agent
    if (agents.length === 0) {
        listeAgentsContainer.innerHTML = '<div class="no-agents">Aucun agent ajouté</div>';
        return;
    }

    // Pour chaque agent, créer une carte
    for (let i = 0; i < agents.length; i++) {
        const agent = agents[i];
        const agentCard = document.createElement('div');
        agentCard.className = 'agent-card';
        agentCard.innerHTML = `
            <img src="${agent.image}" alt="${agent.nom}" class="agent-image"
                onerror="this.src='https://via.placeholder.com/60'">
            <div class="agent-info">
                <div class="agent-name">${agent.nom}</div>
                <div class="agent-role">${agent.role}</div>
                <div class="agent-contact">${agent.email} • ${agent.telephone}</div>
                <span class="agent-department">${agent.salle || 'Non affecté'}</span>
            </div>
            <button class="supprimer-agent" data-id="${agent.id}">×</button>
        `;
        
        listeAgentsContainer.appendChild(agentCard);

        // Événement pour supprimer l'agent
        agentCard.querySelector('.supprimer-agent').addEventListener('click', function(e) {
            e.stopPropagation();
            supprimerAgent(agent.id);
        });

        // Événement pour afficher le profil
        agentCard.addEventListener('click', function(e) {
            if (!e.target.classList.contains('supprimer-agent')) {
                afficherProfilAgent(agent);
            }
        });
    }
}

// Afficher le profil d'un agent
function afficherProfilAgent(agent) {
    const experiencesHTML = agent.experiences && agent.experiences.length > 0 
        ? agent.experiences.map(exp => `
            <div class="experience-item">
                <strong>${exp.titre}</strong><br>
                ${exp.debut} - ${exp.fin}
            </div>
        `).join('')
        : '<div class="no-experience">Aucune expérience renseignée</div>';

    const modalHTML = `
        <div class="modal-profil">
            <div class="modal-profil-content">
                <button class="close-profil">×</button>
                <div class="profil-header">
                    <img src="${agent.image}" alt="${agent.nom}" class="profil-image"
                        onerror="this.src='https://via.placeholder.com/150'">
                    <div class="profil-info">
                        <h2>${agent.nom}</h2>
                        <p class="profil-role">${agent.role}</p>
                        <p class="profil-contact">${agent.email}</p>
                        <p class="profil-contact">${agent.telephone}</p>
                        <p class="profil-localisation">📍 ${agent.salle || 'Non affecté'}</p>
                    </div>
                </div>
                <div class="profil-experiences">
                    <h3>Expériences professionnelles</h3>
                    ${experiencesHTML}
                </div>
                <button class="btn-fermer-profil">Fermer</button>
            </div>
        </div>
    `;

    // Créer et afficher la modal
    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;
    document.body.appendChild(modalElement);

    // Événements pour fermer la modal
    modalElement.querySelector('.close-profil').addEventListener('click', function() {
        modalElement.remove();
    });

    modalElement.querySelector('.btn-fermer-profil').addEventListener('click', function() {
        modalElement.remove();
    });

    modalElement.addEventListener('click', function(e) {
        if (e.target === modalElement) {
            modalElement.remove();
        }
    });
}

// ==================== GESTION DES SALLES ====================

// Ouvrir la sélection d'agents pour une salle
function ouvrirSelectionSalle(roomId, roomName) {
    const agents = chargerAgents();
    const salle = sallesConfig[roomId];

    // Filtrer les agents disponibles
    const agentsDisponibles = agents.filter(function(agent) {
        return !agent.salle && salle.rolesAutorises.includes(agent.role);
    });

    if (agentsDisponibles.length === 0) {
        alert(`Aucun agent disponible pour ${roomName}`);
        return;
    }

    // Créer la liste des agents disponibles
    let message = `Sélectionnez un agent pour ${roomName}:\n\n`;
    for (let i = 0; i < agentsDisponibles.length; i++) {
        message += `${i + 1}. ${agentsDisponibles[i].nom} (${agentsDisponibles[i].role})\n`;
    }

    const choix = prompt(message + '\nEntrez le numéro de l\'agent:');
    
    if (choix && !isNaN(choix)) {
        const index = parseInt(choix) - 1;
        if (index >= 0 && index < agentsDisponibles.length) {
            const agentSelectionne = agentsDisponibles[index];
            ajouterAgentASalle(roomId, agentSelectionne);
        } else {
            alert('Numéro invalide');
        }
    }
}

// Ajouter un agent à une salle
function ajouterAgentASalle(roomId, agent) {
    const salle = sallesConfig[roomId];
    const agents = chargerAgents();

    // Vérifier la capacité
    if (salle.employes.length >= salle.capacite) {
        alert("Capacité maximale atteinte pour cette salle !");
        return false;
    }

    // Retirer l'agent de son ancienne salle
    if (agent.salle) {
        const ancienneSalleId = Object.keys(sallesConfig).find(function(id) {
            return sallesConfig[id].nom === agent.salle;
        });
        if (ancienneSalleId) {
            const ancienneSalle = sallesConfig[ancienneSalleId];
            const index = ancienneSalle.employes.indexOf(agent.id);
            if (index !== -1) {
                ancienneSalle.employes.splice(index, 1);
            }
            // Retirer l'image de l'ancienne salle
            const ancienneImage = document.querySelector(`#${ancienneSalleId} .agent-in-room[data-agent-id="${agent.id}"]`);
            if (ancienneImage) {
                ancienneImage.remove();
            }
        }
    }

    // Mettre à jour l'agent
    const nouveauxAgents = agents.map(function(a) {
        if (a.id === agent.id) {
            return { ...a, salle: salle.nom };
        }
        return a;
    });

    // Mettre à jour la salle
    salle.employes.push(agent.id);

    // Sauvegarder
    sauvegarderAgents(nouveauxAgents);

    // Afficher l'agent dans la salle
    afficherAgentDansSalle(roomId, agent);

    // Mettre à jour l'affichage
    afficherAgents();

    alert(`Agent ${agent.nom} ajouté à ${salle.nom} avec succès !`);
    return true;
}

// Afficher un agent dans une salle
function afficherAgentDansSalle(roomId, agent) {
    const roomElement = document.getElementById(roomId);

    // Supprimer l'image existante
    const imageExistante = roomElement.querySelector(`.agent-in-room[data-agent-id="${agent.id}"]`);
    if (imageExistante) {
        imageExistante.remove();
    }

    // Créer l'image
    const img = document.createElement('img');
    img.src = agent.image;
    img.alt = agent.nom;
    img.className = 'agent-in-room';
    img.dataset.agentId = agent.id;
    img.title = `${agent.nom} (${agent.role})`;

    // Position aléatoire
    const positionX = 10 + Math.random() * 70;
    const positionY = 10 + Math.random() * 70;
    img.style.left = `${positionX}%`;
    img.style.top = `${positionY}%`;

    // Événement pour afficher le profil
    img.addEventListener('click', function(e) {
        e.stopPropagation();
        afficherProfilAgent(agent);
    });

    roomElement.appendChild(img);
}

// Charger les agents dans les salles au démarrage
function chargerAgentsDansSalles() {
    const agents = chargerAgents();
    
    for (let i = 0; i < agents.length; i++) {
        const agent = agents[i];
        if (agent.salle) {
            const salleId = Object.keys(sallesConfig).find(function(id) {
                return sallesConfig[id].nom === agent.salle;
            });
            if (salleId) {
                afficherAgentDansSalle(salleId, agent);
            }
        }
    }
}

// ==================== VALIDATION FORMULAIRE ====================

// Valider un champ
function validerChamp(input, regex, erreurElement, message) {
    const valeur = input.value.trim();
    
    if (valeur === '') {
        input.classList.remove('invalid', 'valid');
        erreurElement.textContent = '';
        return false;
    }
    
    if (!regex.test(valeur)) {
        input.classList.add('invalid');
        input.classList.remove('valid');
        erreurElement.textContent = message;
        return false;
    }
    
    input.classList.remove('invalid');
    input.classList.add('valid');
    erreurElement.textContent = '';
    return true;
}

// Valider le téléphone
function validerTelephone() {
    const valeur = telephoneInput.value.trim();
    const numeroNettoye = valeur.replace(/\s/g, '');
    
    if (numeroNettoye === '') {
        telephoneInput.classList.remove('invalid', 'valid');
        telephoneError.textContent = '';
        return false;
    }
    
    if (!telephoneRegex.test(numeroNettoye)) {
        telephoneInput.classList.add('invalid');
        telephoneInput.classList.remove('valid');
        telephoneError.textContent = 'Le numéro doit commencer par 06 ou 07 et avoir 10 chiffres';
        return false;
    }
    
    // Formater le numéro
    const numeroFormate = numeroNettoye.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    telephoneInput.value = numeroFormate;
    
    telephoneInput.classList.remove('invalid');
    telephoneInput.classList.add('valid');
    telephoneError.textContent = '';
    return true;
}

// Valider le rôle
function validerRole() {
    if (roleInput.value === '') {
        roleInput.classList.add('invalid');
        roleInput.classList.remove('valid');
        roleError.textContent = 'Veuillez choisir un rôle';
        return false;
    }
    
    roleInput.classList.remove('invalid');
    roleInput.classList.add('valid');
    roleError.textContent = '';
    return true;
}

// Valider l'image
function validerImage() {
    const valeur = imageInput.value.trim();
    
    if (valeur === '') {
        imageInput.classList.remove('invalid', 'valid');
        imageError.textContent = '';
        return false;
    }
    
    if (!urlRegex.test(valeur)) {
        imageInput.classList.add('invalid');
        imageInput.classList.remove('valid');
        imageError.textContent = 'URL invalide';
        return false;
    }
    
    imageInput.classList.remove('invalid');
    imageInput.classList.add('valid');
    imageError.textContent = '';
    return true;
}

// Afficher l'aperçu de l'image
function afficherApercuImage() {
    const url = imageInput.value.trim();
    const containerApercu = document.querySelector('.imageworker');
    
    if (url && urlRegex.test(url)) {
        containerApercu.innerHTML = `
            <div style="margin-top: 10px;">
                <p style="font-size: 12px; margin-bottom: 5px; color: #666;">Aperçu :</p>
                <img src="${url}" alt="Aperçu" 
                     style="max-width: 100px; max-height: 100px; border-radius: 5px; border: 2px solid #3498db;"
                     onerror="this.style.display='none'">
            </div>
        `;
    } else {
        containerApercu.innerHTML = '';
    }
}

// Réinitialiser le formulaire
function reinitialiserFormulaire() {
    formulaireAgent.reset();
    const champs = [nomInput, roleInput, imageInput, emailInput, telephoneInput];
    for (let i = 0; i < champs.length; i++) {
        champs[i].classList.remove('invalid', 'valid');
    }
    const erreurs = [nomError, roleError, imageError, emailError, telephoneError];
    for (let i = 0; i < erreurs.length; i++) {
        erreurs[i].textContent = '';
    }
    document.querySelector('.imageworker').innerHTML = '';
}

// Gérer les expériences
function gererExperiences() {
    const boutonAjouterExp = document.getElementById('ajouterexperienceBtn');
    const containerExperiences = document.getElementById('experience-agent');
    
    boutonAjouterExp.addEventListener('click', function() {
        const nouvelleExperience = document.createElement('div');
        nouvelleExperience.className = 'experience-block';
        nouvelleExperience.innerHTML = `
            <div class="input-block">
                <label>Experience professionnelle</label>
                <input type="text" class="exp-title" placeholder="Poste occupé">
            </div>
            <div class="date-pair">
                <div class="input-block date-input-group">
                    <label>Date de debut</label>
                    <input type="date" class="exp-start-date">
                </div>
                <div class="input-block date-input-group">
                    <label>Date de fin</label>
                    <input type="date" class="exp-end-date">
                </div>
            </div>
            <button type="button" class="supprimer-experience">Supprimer</button>
        `;
        
        containerExperiences.appendChild(nouvelleExperience);
        
        // Événement de suppression
        nouvelleExperience.querySelector('.supprimer-experience').addEventListener('click', function() {
            if (document.querySelectorAll('.experience-block').length > 1) {
                nouvelleExperience.remove();
            }
        });
    });
    
    // Événement pour la première expérience
    document.querySelector('.supprimer-experience').addEventListener('click', function() {
        if (document.querySelectorAll('.experience-block').length > 1) {
            this.closest('.experience-block').remove();
        }
    });
}

// Vérifier si le formulaire est valide
function formulaireEstValide() {
    const nomValide = validerChamp(nomInput, nomRegex, nomError, 'Nom invalide');
    const emailValide = validerChamp(emailInput, emailRegex, emailError, 'Email invalide');
    const telephoneValide = validerTelephone();
    const imageValide = validerImage();
    const roleValide = validerRole();
    
    return nomValide && emailValide && telephoneValide && imageValide && roleValide;
}

// ==================== SUPPRESSION AGENTS ====================

// Supprimer un agent
function supprimerAgent(agentId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
        return;
    }

    const agents = chargerAgents();
    const agentIndex = agents.findIndex(function(a) {
        return a.id === agentId;
    });
    
    if (agentIndex !== -1) {
        const agent = agents[agentIndex];
        
        // Retirer l'agent de sa salle
        if (agent.salle) {
            const salleId = Object.keys(sallesConfig).find(function(id) {
                return sallesConfig[id].nom === agent.salle;
            });
            if (salleId) {
                const salle = sallesConfig[salleId];
                const employeIndex = salle.employes.indexOf(agentId);
                if (employeIndex !== -1) {
                    salle.employes.splice(employeIndex, 1);
                }
                
                // Retirer l'image
                const agentImage = document.querySelector(`#${salleId} .agent-in-room[data-agent-id="${agentId}"]`);
                if (agentImage) {
                    agentImage.remove();
                }
            }
        }
        
        // Supprimer l'agent
        agents.splice(agentIndex, 1);
        sauvegarderAgents(agents);
        afficherAgents();
    }
}

// ==================== INITIALISATION ====================

function initialiserApp() {
    // Afficher les agents existants
    afficherAgents();
    
    // Charger les agents dans les salles
    chargerAgentsDansSalles();
    
    // Événement pour ouvrir le formulaire
    ajouterAgentBtn.addEventListener('click', function() {
        fondFormulaire.classList.remove('hidden');
    });
    
    // Bouton X pour fermer le formulaire
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.className = 'close-formulaire';
    closeButton.addEventListener('click', function() {
        fondFormulaire.classList.add('hidden');
        reinitialiserFormulaire();
    });
    document.querySelector('.conteneur-modal').prepend(closeButton);
    
    // Bouton Annuler
    document.getElementById('boutonAnnuler').addEventListener('click', function() {
        fondFormulaire.classList.add('hidden');
        reinitialiserFormulaire();
    });
    
    // Fermer en cliquant à l'extérieur
    fondFormulaire.addEventListener('click', function(e) {
        if (e.target === fondFormulaire) {
            fondFormulaire.classList.add('hidden');
            reinitialiserFormulaire();
        }
    });
    
    // Validation en temps réel
    nomInput.addEventListener('input', function() {
        validerChamp(nomInput, nomRegex, nomError, 'Nom invalide');
    });
    
    emailInput.addEventListener('input', function() {
        validerChamp(emailInput, emailRegex, emailError, 'Email invalide');
    });
    
    telephoneInput.addEventListener('input', function() {
        let valeur = this.value.replace(/[^\d]/g, '');
        if (valeur.length > 10) {
            valeur = valeur.substring(0, 10);
        }
        this.value = valeur;
        validerTelephone();
    });
    
    imageInput.addEventListener('input', function() {
        validerImage();
        afficherApercuImage();
    });
    
    roleInput.addEventListener('change', validerRole);
    
    // Gestion des expériences
    gererExperiences();
    
    // Soumission du formulaire
    formulaireAgent.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (formulaireEstValide()) {
            // Récupérer les expériences
            const experiences = [];
            const blocksExperience = document.querySelectorAll('.experience-block');
            for (let i = 0; i < blocksExperience.length; i++) {
                const block = blocksExperience[i];
                const titre = block.querySelector('.exp-title').value;
                const debut = block.querySelector('.exp-start-date').value;
                const fin = block.querySelector('.exp-end-date').value;
                
                if (titre && debut && fin) {
                    experiences.push({
                        titre: titre,
                        debut: debut,
                        fin: fin
                    });
                }
            }
            
            // Créer nouvel agent
            const nouvelAgent = {
                id: 'agent_' + Date.now(),
                nom: nomInput.value.trim(),
                role: roleInput.value,
                image: imageInput.value.trim(),
                email: emailInput.value.trim(),
                telephone: telephoneInput.value.trim(),
                salle: null,
                experiences: experiences
            };
            
            // Sauvegarder
            const agents = chargerAgents();
            agents.push(nouvelAgent);
            sauvegarderAgents(agents);
            
            alert('Agent ajouté avec succès !');
            afficherAgents();
            fondFormulaire.classList.add('hidden');
            reinitialiserFormulaire();
        } else {
            alert('Veuillez corriger les erreurs dans le formulaire');
        }
    });
    
    // Événements pour les boutons "Ajouter" des salles
    const boutonsSalles = document.querySelectorAll('.aj-room');
    for (let i = 0; i < boutonsSalles.length; i++) {
        boutonsSalles[i].addEventListener('click', function() {
            const roomId = this.closest('.Room').id;
            const roomName = this.getAttribute('data-room-name');
            ouvrirSelectionSalle(roomId, roomName);
        });
    }
}

// Démarrer l'application
document.addEventListener('DOMContentLoaded', initialiserApp);