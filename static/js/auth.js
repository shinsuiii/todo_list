import {
    overlay, modal, closeFormBtn,
    signupBtn, loginBtn,
    signupForm, loginForm,
    switchToSignup, switchToLogin,
    createAccountBtn, loginAccountBtn,
    signupUsernameField, signupEmailField, signupPasswordField,
    loginIdentifierField, loginPasswordField,
    usernameTooltip, usernameTooltipError,
    emailTooltip, emailTooltipError,
    eyeIcons,
    modalUserAccNav, userAccountNav, userAccNavClose,
    errorUsername, errorEmail, errorPassword, errorLogin
} from './dom_elements.js'
import { regexUsername, regexEmail, regexPassword } from './regex.js'
import { getUser, createAccountRequest, loginAccountRequest } from './api.js'

const remPerError = 3

export function initAuth() {
    userAccountNav.addEventListener('click', () => {
        modalUserAccNav.classList.toggle('hidden', !modalUserAccNav.classList.contains('hidden'))
    })
    userAccNavClose.addEventListener('click', () => {
        modalUserAccNav.classList.add('hidden')
    })

    signupBtn.addEventListener('click', () => openSignup())
    switchToSignup.addEventListener('click', () => openSignup())
    loginBtn.addEventListener('click', () => openLogin())
    switchToLogin.addEventListener('click', () => openLogin())

    closeFormBtn.addEventListener('click', hideModal)
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') hideModal()
    })

    usernameTooltip.addEventListener('mouseenter', () => usernameTooltipError.classList.remove('hidden'))
    usernameTooltip.addEventListener('mouseleave', () => usernameTooltipError.classList.add('hidden'))
    emailTooltip.addEventListener('mouseenter', () => emailTooltipError.classList.remove('hidden'))
    emailTooltip.addEventListener('mouseleave', () => emailTooltipError.classList.add('hidden'))

    eyeIcons.forEach(eye => {
        eye.addEventListener('click', (event) => {
            const passwordInputField = event.target.previousElementSibling
            const isHidden = passwordInputField.type === 'password'
            passwordInputField.type = isHidden ? 'text' : 'password'
            eye.src = isHidden ? '/static/assets/img/eye-open.svg' : '/static/assets/img/eye-closed.svg'
        })
    })

    createAccountBtn.addEventListener('click', handleCreateAccount)
    loginAccountBtn.addEventListener('click', handleLogin)

    blurValidation(signupUsernameField, errorUsername, regexUsername)
    blurValidation(signupEmailField, errorEmail, regexEmail)
    blurValidation(signupPasswordField, errorPassword, regexPassword)
}



function openSignup() {
    showModal(signupForm)
    signupUsernameField.focus()
}

function openLogin() {
    showModal(loginForm)
    loginIdentifierField.focus()
}



function showModal(form) {
    overlay.classList.remove('hidden')
    modal.classList.remove('hidden')
    signupForm.classList.add('hidden')
    loginForm.classList.add('hidden')
    form.classList.remove('hidden')
    adjustModalHeight()
}

function hideModal() {
    overlay.classList.add('hidden')
    modal.classList.add('hidden')
    signupForm.classList.add('hidden')
    loginForm.classList.add('hidden')
}

function adjustModalHeight() {
    const activeForm = signupForm.classList.contains('hidden') ? loginForm : signupForm
    if (activeForm.classList.contains('hidden')) return

    const baseHeight = activeForm === signupForm ? 26.75 : 22
    const visibleErrors = activeForm.querySelectorAll('.errorMessage:not(.hidden)').length
    modal.style.height = `${baseHeight + (visibleErrors * remPerError)}rem`
}



function checkField(field, error, regex) {
    error.classList.toggle('hidden', regex.test(field.value.trim()))
    adjustModalHeight()
}

function blurValidation(field, error, regex) {
    let blurred = false
    field.addEventListener('input', () => {
        if (blurred) checkField(field, error, regex)
    })
    field.addEventListener('blur', async () => {
        blurred = true
        checkField(field, error, regex)
        await checkUserExistence(field.type, field.value)
    })
}



async function handleCreateAccount(event) {
    event.preventDefault()
    createAccountBtn.disabled = true
    if (document.activeElement.tagName === 'INPUT') document.activeElement.blur()

    const [usernameExists, emailExists] = await Promise.all([
        checkUserExistence('text', signupUsernameField.value),
        checkUserExistence('email', signupEmailField.value)
    ])
    const visibleErrors = signupForm.querySelectorAll('.errorMessage:not(.hidden)').length

    if (!usernameExists && !emailExists && visibleErrors === 0) {
        const modalCreatedAccount = document.querySelector('.modalAccCreated')

        await createAccountRequest({
            username: signupUsernameField.value,
            email: signupEmailField.value,
            password: signupPasswordField.value,
        })

        hideModal()
        showConfirmation(modalCreatedAccount)
        signupForm.querySelectorAll('input').forEach(inputField => inputField.value = '')
    }
    createAccountBtn.disabled = false
}

async function checkUserExistence(text_type, identifier) {
    if (text_type === 'password') return false
    try {
        const exists = await getUser(text_type, identifier)
        const tooltip = text_type === 'email' ? emailTooltip : usernameTooltip
        tooltip.classList.toggle('hidden', !exists)
        return exists
    } catch (error) {
        console.error('Error fetching data: ', error)
        return false
    }
}



async function handleLogin(event) {
    event.preventDefault()
    loginAccountBtn.disabled = true

    if (loginIdentifierField.value === '' || loginPasswordField.value === '') {
        loginAccountBtn.disabled = false
        return
    }

    const login_success = await loginAccountRequest({
        identifier: loginIdentifierField.value,
        password: loginPasswordField.value
    })
    const modalLoginSuccessfully = document.querySelector('.modalAccLogin')

    if (login_success) {
        hideModal()
        showConfirmation(modalLoginSuccessfully)
        loginForm.querySelectorAll('input').forEach(inputField => inputField.value = '')
    }

    errorLogin.classList.toggle('hidden', login_success)
    adjustModalHeight()
    loginAccountBtn.disabled = false
}



function showConfirmation(modalElement) {
    overlay.classList.remove('hidden')
    modalElement.classList.remove('hidden')
    setTimeout(() => {
        overlay.classList.add('hidden')
        modalElement.classList.add('hidden')
    }, 3000)
}