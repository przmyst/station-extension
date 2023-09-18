import { useTranslation } from "react-i18next"
import SettingsIcon from "@mui/icons-material/Settings"
import { ReactComponent as BackIcon } from "styles/images/icons/BackButton.svg"
import { FlexColumn } from "station-ui"
import { sandbox } from "auth/scripts/env"
import HeaderIconButton from "../components/HeaderIconButton"
import NetworkSetting from "./NetworkSetting"
import LanguageSetting from "./LanguageSetting"
import SecuritySetting from "./SecuritySetting"
import CurrencySetting from "./CurrencySetting"
import { ModalButton, NavButton, SectionHeader } from "station-ui"
import { useNetworkName } from "data/wallet"
import { useCurrency } from "data/settings/Currency"
import { Languages } from "config/lang"
import { capitalize } from "@mui/material"
import { useAuth } from "auth"
import { useNavigate } from "react-router-dom"
import { ReactElement, useState } from "react"
import AddressBookNew from "txs/AddressBook/AddressBookNew"
import styles from "./Preferences.module.scss"
import LockWallet from "auth/modules/manage/LockWallet"
import { useManageWallet } from "auth/modules/manage/ManageWallets"
// import SelectTheme from "./SelectTheme"
import LCDSetting from "./LCDSetting"
// import { useTheme } from "data/settings/Theme"
// import AdvancedSettings from "./AdvancedSettings"
import ContactsIcon from "@mui/icons-material/Contacts"
import { ReactComponent as ManageAssets } from "styles/images/icons/ManageAssets.svg"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import ChangePasswordForm from "auth/modules/manage/ChangePasswordForm"
import ManageCustomTokens from "pages/custom/ManageCustomTokens"

interface SettingsPage {
  key: string
  tab: string
  value?: string
  hide?: boolean // hide from main menu if subpage
  icon?: ReactElement
  onClick?: () => void
}

const Preferences = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState<string | null>(null)

  const { i18n } = useTranslation()
  const { id: currencyId } = useCurrency()
  const networkName = useNetworkName()
  // const { lock } = useAuth()
  // const navigate = useNavigate()

  const network = {
    network: {
      key: "network",
      tab: t("Network"),
      value: capitalize(networkName),
      hide: !sandbox,
      seperator: true,
    },
  }
  const functions = {
    addressBook: {
      key: "addressBook",
      tab: t("Address Book"),
      icon: <ContactsIcon />,
    },
    manageTokens: {
      key: "manageTokens",
      tab: t("Manage Tokens"),
      icon: <ManageAssets />,
    },
    lockWallet: {
      key: "lockWallet",
      tab: t("Lock Wallet"),
      icon: <LockOutlinedIcon />,
      seperator: true,
      onClick: () => {
        // lock()
        // setPage(null)
        // navigate("/", { replace: true })
      },
    },
  }

  const settings = {
    lang: {
      key: "lang",
      tab: t("Language"),
      value:
        Object.values(Languages ?? {}).find(
          ({ value }) => value === i18n.language
        )?.label ?? Languages.en.label,
    },
    currency: {
      key: "currency",
      tab: t("Currency"),
      value: currencyId,
    },
    security: {
      key: "security",
      tab: t("Security"),
      icon: <LockOutlinedIcon />,
    },
  }

  const subPages = {
    lcd: {
      key: "lcd",
      tab: t("Add LCD Endpoint"),
      hide: true,
    },
    changePassword: {
      key: "changePassword",
      tab: t("Change Password"),
      icon: <LockOutlinedIcon />,
      hide: true,
    },
  }

  const routes: Record<string, SettingsPage> = {
    ...network,
    ...functions,
    ...settings,
    ...subPages,
  }

  const SettingsGroup = ({
    settings,
  }: {
    settings: Record<string, SettingsPage>
  }) => (
    <>
      <SectionHeader withLine />
      {Object.values(settings).map(({ tab, key, icon, value }) => (
        <NavButton
          label={tab}
          key={key}
          value={value}
          icon={icon}
          onClick={() => setPage(key)}
        />
      ))}
    </>
  )

  const SettingsMenu = () => (
    <FlexColumn gap={8}>
      {sandbox && (
        <NavButton label={t(routes.network.tab)} {...routes.network} />
      )}
      <SettingsGroup settings={functions} />
      <SettingsGroup settings={settings} />
    </FlexColumn>
  )

  const renderSettings = () => {
    switch (page) {
      case "network":
        return <NetworkSetting subPageNav={() => setPage("lcd")} />
      case "currency":
        return <CurrencySetting />
      case "lang":
        return <LanguageSetting />
      case "changePassword":
        return <ChangePasswordForm />
      case "security":
        return <SecuritySetting subPageNav={() => setPage("changePassword")} />
      // case "theme":
      //   return <SelectTheme />
      case "addressBook":
        return <AddressBookNew />
      case "manageTokens":
        return <ManageCustomTokens />
      case "lcd":
        return <LCDSetting />
      // case "advanced":
      //   return <AdvancedSettings />
      default:
        return <SettingsMenu />
    }
  }

  const renderTitle = () =>
    page ? (
      <div>
        <button
          className={styles.back}
          onClick={() => setPage(page === "lcd" ? "network" : null)}
        >
          <BackIcon width={18} height={18} />
        </button>
        {routes[page].tab}
      </div>
    ) : (
      t("Settings")
    )

  return (
    <ModalButton
      title={renderTitle()}
      renderButton={(open) => (
        <HeaderIconButton
          onClick={() => {
            open()
            setPage(null)
          }}
        >
          <SettingsIcon style={{ fontSize: 20 }} />
        </HeaderIconButton>
      )}
    >
      {renderSettings()}
    </ModalButton>
  )
}

export default Preferences
