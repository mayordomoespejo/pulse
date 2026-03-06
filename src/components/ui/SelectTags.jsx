import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { getTags } from '../../services/tags/getTags'

import SelectInput from './SelectInput'

function SelectTags({
  label,
  placeholder,
  useParams = true,
  value: externalValue,
  onChange: externalOnChange,
  useFormik = false,
  optionsOverride = [],
  ...props
}) {

  const { t } = useTranslation()
  const CONSTANTS = t('CONSTANTS', { returnObjects: true })

  const { data: tagsData } = useQuery({ queryKey: ['tags'], queryFn: getTags })

  const tagsOptions = Array.isArray(optionsOverride) && optionsOverride.length > 0
    ? optionsOverride
    : tagsData?.data?.map((tag) => ({ ...tag, label: tag.name, value: tag.id, color: tag?.color ?? 'default' }))
  const [searchParams, setSearchParams] = useSearchParams()

  const handleTagsChange = (options) => {
    const next = new URLSearchParams(searchParams)
    const value = (options ?? []).map((opt) => opt.value).join(',')
    if (value) {
      next.set('tags', value)
      next.delete('page')
      setSearchParams(next)
      return
    }
    next.delete('tags')
    next.delete('page')
    setSearchParams(next)
  }

  const selectedTagIds = searchParams.get('tags') || ''
  const selectedOptions = tagsOptions?.filter((option) => selectedTagIds.split(',').map((id) => id.trim()).includes(String(option.value))) || []
  const selectValue = useParams ? selectedOptions : externalValue
  const selectOnChange = useParams ? handleTagsChange : externalOnChange

  const propsFormik = !useFormik ? {
    value: selectValue,
    onChange: selectOnChange,
  } : {}

  return (
    <SelectInput
      useFormik={useFormik}
      options={tagsOptions}
      isMulti
      placeholder={placeholder || CONSTANTS.TAGS_PLACEHOLDER}
      label={label}
      typeStyled="secondary"
      {...props}
      {...propsFormik}
    />
  )
}
export default SelectTags
