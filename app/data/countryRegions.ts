import { allCountries } from 'country-region-data';

export const countries = allCountries.map((c) => c[0]).sort();

export const regionsByCountry: Record<string, string[]> = {};
allCountries.forEach((c) => {
    if (c[2] && c[2].length) {
        regionsByCountry[c[0]] = c[2].map((r) => r[0]);
    }
});
