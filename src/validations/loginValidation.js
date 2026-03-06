import * as Yup from 'yup'

export const loginValidation = (t) => Yup.object({
  username: Yup.string().required(t('LOGIN.VALIDATION.USERNAME_REQUIRED')),
  password: Yup.string().required(t('LOGIN.VALIDATION.PASSWORD_REQUIRED')),
})