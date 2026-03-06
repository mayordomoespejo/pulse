import { useMutation } from '@tanstack/react-query'
import { Formik, Form } from 'formik'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate, Navigate } from 'react-router-dom'

import { EyeToggleIcon, LogoTextIcon } from '../assets/icons/icons'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Spinner from '../components/ui/Spinner'
import { ROUTES_NAMES } from '../router/routesNames'
import { loginService } from '../services/auth/login'
import { setToken, isAuthenticated } from '../utils/auth'
import { loginValidation } from '../validations/loginValidation'

/**
 * Login - Página de inicio de sesión
 * 
 * Maneja la autenticación de usuarios mediante formulario con validación.
 * Redirige a usuarios ya autenticados y muestra errores de autenticación.
 * 
 * @component
 * @returns {JSX.Element} Página de login con formulario de autenticación
 */
function Login() {
  const demoUsername = import.meta.env.VITE_DEMO_USERNAME || 'demo@pulse.dev'
  const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || 'Pulse123!'
  const logoRef = useRef(null)
  const inputsRef = useRef(null)
  const emptyStateTimeoutRef = useRef(null)
  const [showPassword, setShowPassword] = useState(false)
  const [activeInputName, setActiveInputName] = useState(null)
  const [lastActiveInputName, setLastActiveInputName] = useState('username')
  const [isEmptyStateVisible, setIsEmptyStateVisible] = useState(false)
  const [shouldRenderEmptyState, setShouldRenderEmptyState] = useState(false)
  const navigate = useNavigate()
  const alreadyLogged = isAuthenticated()
  const { t } = useTranslation()
  const LOGIN = t('LOGIN', { returnObjects: true })

  const { mutate: mutateLogin, isPending: isLoginPending } = useMutation({
    mutationFn: (data) => loginService(data),

  })

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setSubmitting(true)
    mutateLogin(values, {
      onSuccess: ({ data }) => {
        setToken(data?.accessToken)
        navigate(ROUTES_NAMES.ROOT, { replace: true })
        toast.success(LOGIN.TOAST.SUCCESS)
      },
      onError: (error) => {
        const { status, response } = error || {}
        if (status === 500) {
          return toast.error(LOGIN.TOAST.ERROR)
        }
        const message = response?.data?.errorKey
          ? t(response.data.errorKey)
          : response?.data?.errors?.join(', ')

        setFieldError('global', message || LOGIN.ERRORS.DEFAULT)
      },
      onSettled: () => {
        setSubmitting(false)
      },
    })
  }

  const initialValues = {
    username: '',
    password: '',
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const handleInputsFocusCapture = (event) => {
    const inputName = event?.target?.name
    if (inputName === 'username' || inputName === 'password') {
      setActiveInputName(inputName)
    }
  }

  const handleInputsBlurCapture = () => {
    setTimeout(() => {
      if (!inputsRef.current?.contains(document.activeElement)) {
        setActiveInputName(null)
        return
      }

      const focusedName = document.activeElement?.name
      if (focusedName === 'username' || focusedName === 'password') {
        setActiveInputName(focusedName)
      }
    }, 0)
  }

  const emptyStateTarget = activeInputName || lastActiveInputName
  const emptyStateValue = emptyStateTarget === 'password' ? demoPassword : demoUsername

  useEffect(() => {
    const target = logoRef.current
    if (!target) return undefined

    const HOVER_RADIUS_X = 300
    const HOVER_RADIUS_TOP = 300
    const HOVER_RADIUS_BOTTOM = 60

    const handleMove = (event) => {
      const rect = target.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      target.style.setProperty('--logo-hover-x', `${x}px`)
      target.style.setProperty('--logo-hover-y', `${y}px`)

      const withinX = event.clientX >= rect.left - HOVER_RADIUS_X &&
        event.clientX <= rect.right + HOVER_RADIUS_X
      const withinTop = event.clientY >= rect.top - HOVER_RADIUS_TOP
      const withinBottom = event.clientY <= rect.bottom + HOVER_RADIUS_BOTTOM
      const isNear = withinX && withinTop && withinBottom
      if (isNear) {
        target.dataset.hover = 'true'
      } else {
        delete target.dataset.hover
      }
    }

    const handleLeave = () => {
      delete target.dataset.hover
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseleave', handleLeave)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  useEffect(() => {
    if (emptyStateTimeoutRef.current) {
      clearTimeout(emptyStateTimeoutRef.current)
      emptyStateTimeoutRef.current = null
    }

    if (activeInputName) {
      setLastActiveInputName(activeInputName)
      setShouldRenderEmptyState(true)
      requestAnimationFrame(() => setIsEmptyStateVisible(true))
      return undefined
    }

    setIsEmptyStateVisible(false)
    emptyStateTimeoutRef.current = setTimeout(() => {
      setShouldRenderEmptyState(false)
    }, 180)

    return undefined
  }, [activeInputName])

  useEffect(() => {
    return () => {
      if (emptyStateTimeoutRef.current) {
        clearTimeout(emptyStateTimeoutRef.current)
      }
    }
  }, [])

  if (alreadyLogged) {
    return <Navigate to={ROUTES_NAMES.ROOT} replace />
  }

  return (
    <div className="login-page">
      <div className="login-page__bg" />
      <div className="login-page__content">
        <div className="login-page__logo-wrap" ref={logoRef}>
          <LogoTextIcon className="login-page__logo" fill="currentColor" />
          <LogoTextIcon className="login-page__logo login-page__logo--hover" fill="currentColor" />
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={loginValidation(t)}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form id="login-form" className="login-page__form" autoComplete="off" data-form-type="other">
              <div className="login-page__inputs">
                <div
                  className="login-page__fields"
                  ref={inputsRef}
                  onFocusCapture={handleInputsFocusCapture}
                  onBlurCapture={handleInputsBlurCapture}
                >
                  <Input
                    name="username"
                    type="text"
                    label={LOGIN.USERNAME_LABEL}
                    variant="primary"
                    placeholder={demoUsername}
                    autoComplete="off"
                  />
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label={LOGIN.PASSWORD_LABEL}
                    variant="primary"
                    placeholder={demoPassword}
                    autoComplete="new-password"
                    iconAfterInteractive
                    IconAfter={(
                      <button
                        type="button"
                        className="login-page__password-toggle"
                        aria-label={showPassword ? LOGIN.HIDE_PASSWORD : LOGIN.SHOW_PASSWORD}
                        aria-pressed={showPassword}
                        onClick={togglePasswordVisibility}
                      >
                        <EyeToggleIcon stroke="currentColor" isOpen={showPassword} />
                      </button>
                    )}
                  />
                </div>
                {errors?.global && <p className="input__error login-page__error">{errors?.global}</p>}
              </div>
              <Button
                type="submit"
                className="login-page__button"
                label={LOGIN.SUBMIT}
                iconEnd={isSubmitting || isLoginPending
                  ? <Spinner size="button" /> : null}
                disabled={isSubmitting || isLoginPending}
              />
            </Form>
          )}
        </Formik>
      </div>
      {shouldRenderEmptyState && (
        <div
          className={`login-page__empty-state-anchor ${isEmptyStateVisible ? 'login-page__empty-state-anchor--visible' : ''}`}
          aria-live="polite"
        >
          <EmptyState
            className="login-page__empty-state"
            textColor="primary"
            text={(
              <Trans
                i18nKey="LOGIN.DEMO_HINT"
                values={{ value: emptyStateValue }}
                components={{ 1: <span className="login-page__empty-state-value" /> }}
              />
            )}
          />
        </div>
      )}
    </div>
  )
}

export default Login
