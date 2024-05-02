import Image from "next/image";
import type { RepoProvider } from "../utils/providerAPI";
import React from "react";

export const getProviderLogoSrc = (provider: RepoProvider, theme: "light" | "dark") => `/${provider}${theme === 'dark' ? "-dark" : ""}.svg`;

const ProviderLogo: React.FC<{ provider: RepoProvider, theme: "light" | "dark", className?: string }> = ({ provider, theme, className }) => {
	return (
		<Image
			loading="lazy"
			height={24} width={24}
			src={getProviderLogoSrc(provider, theme)}
			alt={provider}
			title={provider}
			className={className}
		/>
	)
}

export default ProviderLogo;