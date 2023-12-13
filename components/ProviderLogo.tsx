import Image from "next/image";
import type { RepoProvider } from "../utils/providerAPI";
import React from "react";

const ProviderLogo: React.FC<{ provider: RepoProvider, theme: "light" | "dark", className?: string }> = ({ provider, theme, className }) => {
	return (
		<Image
			loading="lazy"
			height={24} width={24}
			src={`/${provider}${theme === 'dark' ? "-dark" : ""}.svg`}
			alt={provider}
			title={provider}
			className={`mx-auto ${className}`}
		/>
	)
}

export default ProviderLogo;