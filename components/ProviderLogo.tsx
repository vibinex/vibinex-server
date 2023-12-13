import Image from "next/image";
import type { RepoProvider } from "../utils/providerAPI";

const ProviderLogo = (provider: RepoProvider, theme: "light" | "dark") => {
	return (
		<Image
			loading="lazy"
			height={24} width={24}
			src={`/${provider}${theme === 'dark' ? "-dark" : ""}.svg`}
			alt={provider}
			className="mx-auto"
		/>
	)
}

export default ProviderLogo;