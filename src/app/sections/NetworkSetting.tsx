import { useNetworkOptions, useNetworkState } from "data/wallet"
import SettingsSelector from "components/layout/SettingsSelector"
import { NavButton } from "station-ui"
import { FlexColumn } from "components/layout"
import AddIcon from "@mui/icons-material/Add"

interface Props {
  subPageNav: (page: string) => void
}

const NetworkSetting = (props: Props) => {
  const [network, setNetwork] = useNetworkState()
  const networkOptions = useNetworkOptions()

  if (!networkOptions) return null

  return (
    <FlexColumn gap={16}>
      <SettingsSelector
        accordion
        options={networkOptions}
        value={network}
        onChange={setNetwork}
      />
      <NavButton
        icon={<AddIcon />}
        label="Add Custom LCD Endpoint"
        onClick={() => props.subPageNav("lcd")}
      />
    </FlexColumn>
  )
}

export default NetworkSetting
