import * as Yup from 'yup'

import { isValidHexColor } from '../utils/colors'

export const tagValidation = (t) =>
  Yup.object({
    name: Yup.string().trim().required(t('TAG_FORM_MODAL.VALIDATION.NAME')),
    color: Yup.string().test('is-valid-hex', t('TAG_FORM_MODAL.VALIDATION.COLOR_INVALID'),
      (value) => isValidHexColor(value))
      .required(t('TAG_FORM_MODAL.VALIDATION.COLOR_REQUIRED')),
  })
