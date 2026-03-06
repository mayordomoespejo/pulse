import { useTranslation } from 'react-i18next'

const Home = () => {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('HOME.TITLE')}</h1>
      <p>{t('HOME.DESCRIPTION')}</p>
    </div>
  )
}

export default Home 
