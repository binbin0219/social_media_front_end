import { countries, regionsByCountry } from "@/data/countryRegions";
import React from "react";

interface CountryRegionSelectorProps {
    selectedCountry: string;
    selectedRegion: string;
    onCountryChange: (country: string) => void;
    onRegionChange: (region: string) => void;
}

const CountryRegionSelector: React.FC<CountryRegionSelectorProps> = ({
    selectedCountry,
    selectedRegion,
    onCountryChange,
    onRegionChange,
}) => {
    const regions = regionsByCountry[selectedCountry] || [];

    return (
        <div className="flex w-full justify-between">
            <div className="w-[45%]">
                <label htmlFor="country_selector" className="block font-bold">Country</label>
                <select
                id="country_selector"
                name="country"
                value={selectedCountry}
                onChange={(e) => {
                    onCountryChange(e.target.value);
                    onRegionChange("");
                }}
                className="crs-country px-3 py-2 border-2 border-slate-200 rounded-lg w-full"
                >
                <option value="">Select Country</option>
                {countries.map((country) => (
                    <option key={country} value={country}>
                    {country}
                    </option>
                ))}
                </select>
            </div>

            <div className="w-[45%]">
                <label htmlFor="region_selector" className="block font-bold">Region</label>
                <select
                id="region_selector"
                name="region"
                value={selectedRegion}
                onChange={(e) => onRegionChange(e.target.value)}
                disabled={!selectedCountry}
                className="px-3 py-2 border-2 border-slate-200 rounded-lg w-full"
                >
                <option value="">Select Region</option>
                {regions.map((region) => (
                    <option key={region} value={region}>
                    {region}
                    </option>
                ))}
                </select>
            </div>
        </div>
    );
};

export default CountryRegionSelector;
