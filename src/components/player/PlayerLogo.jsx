function PlayerLogo({
  className = '',
  width = 90,
  height = 90,
}) {

  return (
    <svg width={width} height={height} viewBox="0 0 100 100" fill="none" className={className}>
      <g clipPath="url(#clip0_59_490)">
        <path d="M100 0H0V100.558H100V0Z" fill="#05ACA6" />
        <path d="M83.7109 35.9615H76.4609V64.0577H83.7109V35.9615Z" fill="white" />
        <path d="M23.5186 35.9615H16.2686V64.0577H23.5186V35.9615Z" fill="white" />
        <path d="M96.9997 97H2.98047V2.98077H96.9997V97ZM9.53816 90.4615H90.442V9.55769H9.53816V90.4615Z" fill="white" />
        <path d="M36.3074 69.3462L49.4035 51.8846H50.9036L63.7112 69.4038V30.4038H71.2882V80.3654H62.5574L49.9805 63.0769L37.4035 80.3654H28.7305V30.4038H36.3074V69.3462Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_59_490">
          <rect width="100" height="100" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default PlayerLogo