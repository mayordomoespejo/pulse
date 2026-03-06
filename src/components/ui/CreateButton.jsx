import { PlusIcon } from '../../assets/icons/icons'

import Button from './Button'

function CreateButton({ label, onClick }) {
  return (
    <Button
      className="create-button"
      label={label}
      onClick={onClick}
      variant="secondary"
      iconStart={<PlusIcon />}
      mobileIconOnly
    />
  )
}

export default CreateButton
