// Task content
export const template = document.getElementById('todo-template')
export const container = document.getElementById('todo-main')
export const addTaskBtn = document.getElementById('add-task')


// Modal shell
export const overlay = document.getElementById('modalOverlay')
export const modal = document.getElementById('modalContainer')
export const closeFormBtn = document.getElementById('closeModal')


// Navigation bar authentication buttons
export const signupBtn = document.getElementById('signupBtn')
export const loginBtn = document.getElementById('loginBtn')


// Authentication forms
export const signupForm = document.getElementById('panelSignUp')
export const loginForm = document.getElementById('panelLogIn')


// Links that swap between the two panels
export const switchToSignup = document.getElementById('switchToSignup')
export const switchToLogin = document.getElementById('switchToLogin')


// Submit buttons
export const createAccountBtn = document.getElementById('createAccountBtn')
export const loginAccountBtn = document.getElementById('loginAccountBtn')


// Signup fields
export const signupUsernameField = document.getElementById('signupUsername')
export const signupEmailField = document.getElementById('signupEmail')
export const signupPasswordField = document.getElementById('signupPassword')


// Login fields
export const loginIdentifierField = document.getElementById('loginIdentifier')
export const loginPasswordField = document.getElementById('loginPassword')


// "Already taken" tooltips
export const usernameTooltip = document.getElementById('usernameTooltip')
export const usernameTooltipError = document.getElementById('usernameTooltipError')
export const emailTooltip = document.getElementById('emailTooltip')
export const emailTooltipError = document.getElementById('emailTooltipError')


// Password show/hide icons
export const eyeIcons = document.querySelectorAll('.fieldImg')


// Account navigation (top-right menu)
export const modalUserAccNav = document.getElementById('modalUserAccNav')
export const userAccountNav = document.getElementById('userAccount')
export const userAccNavClose = document.getElementById('userAccNavCloseBtn')
export const userAccNavLogin = document.getElementById('userAccNavLogin')
export const userAccNavLogout = document.getElementById('userAccNavLogout')


// Field-level error messages
export const errorUsername = document.getElementById('errorUsername')
export const errorEmail = document.getElementById('errorEmail')
export const errorPassword = document.getElementById('errorPassword')
export const errorLogin = document.getElementById('errorLogin')
