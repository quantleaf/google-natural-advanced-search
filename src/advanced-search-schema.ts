import { ClassInfo, FieldInfo } from '@quantleaf/query-sdk-node'; //, translate, config
import { StandardDomain } from '@quantleaf/query-schema';
export const dateKey = 'date';
export const allWordsKey = 'allWordsKey';
export const anyOfKey = 'anyOfWords';
export const exactPhraseKey = 'exactPhrase';
export const notAnyOfWordsKey = 'nonOfWords';
export const numbersRangeKey = 'numbersRange';
export const unitKey = 'unit';
export const languageKey = 'language';
export const countryKey = 'country';
export const websiteKey = 'site';
export const textLocationKey = 'textLocation';
export const safeSearchKey = 'safeSearch';
export const fileTypeKey = 'fileType';
export const licenseKey = 'license';
export const resultTypeKey = 'resultType';

// Images
/*export const imageSizeKey = 'imageSize';
export const imageColorKey = 'imageColor';
export const imageTypeKey = 'imageTypeKey';
export const imageLicenseKey = 'imageLicense';*/

@ClassInfo({
    key: 'general-search',
    description: 'general search'
})
export class GeneralSearch {
    @FieldInfo({
        key: resultTypeKey,
        description: 'result type',
        domain: {
            'isch': ['images', 'pictures','images of', 'pictures of'],
            'vid': ['videos', 'clips','videos  of', 'clips of'],
            'nws': ['news','news of'],
            'bks': ['books', 'literature'],
            'shop': ['shopping', 'shop','buy']
        }
    })
    contentType: string;


    @FieldInfo({
        key: allWordsKey,
        description: ["content", "contains", "containing", "about", "all of"],
        domain: StandardDomain.TEXT
    })
    allwords: string;

    @FieldInfo({
        key: exactPhraseKey,
        description: ["exact phrase", "exact match", "perfect match", "exact"],
        domain: StandardDomain.TEXT
    })
    exactPhrase: string;

   
    @FieldInfo({
        key: anyOfKey,
        description: ["any words", "any of", "has any of", "containing any of", "contains any of"],
        domain: StandardDomain.TEXT
    })
    anyOfWords: string;

    @FieldInfo({
        key: notAnyOfWordsKey,
        description: ["not contains", "not any of", "non of", "non of the words", "dont contain", "don't contain", "dont include", "don't include","not including"],
        domain: StandardDomain.TEXT
    })
    notAnyOfWords: string;

    @FieldInfo({
        key: websiteKey,
        description: ["website", "site"],
        domain: StandardDomain.TEXT
    })
    website: string;

    
    @FieldInfo({
        key: numbersRangeKey,
        description: 'numbers',
        domain: StandardDomain.NUMBER
    })
    numbersRange: number;

    @FieldInfo({
        key: unitKey,
        description: 'unit',
        domain: StandardDomain.TEXT
    })
    unit: number;

    @FieldInfo({
        key: dateKey,
        description: 'date',
        domain: StandardDomain.DATE
    })
    date: Date;

    @FieldInfo({
        key: textLocationKey,
        description: 'text location',
        domain: {
            allintitle: 'in title',
            allintext: 'in text',
            allinurl: ['in url', 'in web adress'],
            allinanchor: ['in links to site']
        }
    })
    textLocationKey: Date;


    @FieldInfo({
        key: safeSearchKey,
        description: 'safety filter',
        domain: {
            safe: ['safe search', 'safesearch']
        }
    })
    safeSearch: string;

    @FieldInfo({
        key: fileTypeKey,
        description: ['file type', 'filetype', 'file format'],
        domain: StandardDomain.TEXT
    })
    fileType: string;

    @FieldInfo({
        key: licenseKey,
        description: ['license', 'usage rights', 'usage right'],
        domain: {
            f: 'free to use or share',
            fc: ['free to use or share, even commercially', 'free to use or share even commercially'],
            fm: ['free to use, share or modify','free to use share or modify'],
            fmc: ['free to use, share or modify, even commercially','commercial use'],
        }
    })
    license: string;

    @FieldInfo(
        {
            key: languageKey,
            description: ['language','from'],
            domain: {
                "lang_af": "Afrikaans",
                "lang_ar": "Arabic",
                "lang_hy": "Armenian",
                "lang_be": "Belarusian",
                "lang_bg": "Bulgarian",
                "lang_ca": "Catalan",
                "lang_zh-CN": "Chinese simplified",
                "lang_zh-TW": "Chinese traditional",
                "lang_hr": "Croatian",
                "lang_cs": "Czech",
                "lang_da": "Danish",
                "lang_nl": "Dutch",
                "lang_en": "English",
                "lang_eo": "Esperanto",
                "lang_et": "Estonian",
                "lang_tl": "Filipino",
                "lang_fi": "Finnish",
                "lang_fr": "French",
                "lang_de": "German",
                "lang_el": "Greek",
                "lang_iw": "Hebrew",
                "lang_hi": "Hindi",
                "lang_hu": "Hungarian",
                "lang_is": "Icelandic",
                "lang_id": "Indonesian",
                "lang_it": "Italian",
                "lang_ja": "Japanese",
                "lang_ko": "Korean",
                "lang_lv": "Latvian",
                "lang_lt": "Lithuanian",
                "lang_no": "Norwegian",
                "lang_fa": "Persian",
                "lang_pl": "Polish",
                "lang_pt": "Portuguese",
                "lang_ro": "Romanian",
                "lang_ru": "Russian",
                "lang_sr": "Serbian",
                "lang_sk": "Slovak",
                "lang_sl": "Slovenian",
                "lang_es": "Spanish",
                "lang_sw": "Swahili",
                "lang_sv": "Swedish",
                "lang_th": "Thai",
                "lang_tr": "Turkish",
                "lang_uk": "Ukrainian",
                "lang_vi": "Vietnamese"
            }
        }
    )
    lanugage: string;


    @FieldInfo(
        {
            key: countryKey,
            description: ['country', 'region','from'],
            domain: {
                "countryAF": "Afghanistan",
                "countryAL": "Albania",
                "countryDZ": "Algeria",
                "countryAS": "American Samoa",
                "countryAD": "Andorra",
                "countryAO": "Angola",
                "countryAI": "Anguilla",
                "countryAQ": "Antarctica",
                "countryAG": "Antigua and Barbuda",
                "countryAR": "Argentina",
                "countryAM": "Armenia",
                "countryAW": "Aruba",
                "countryAU": "Australia",
                "countryAT": "Austria",
                "countryAZ": "Azerbaijan",
                "countryBS": "Bahamas",
                "countryBH": "Bahrain",
                "countryBD": "Bangladesh",
                "countryBB": "Barbados",
                "countryBY": "Belarus",
                "countryBE": "Belgium",
                "countryBZ": "Belize",
                "countryBJ": "Benin",
                "countryBM": "Bermuda",
                "countryBT": "Bhutan",
                "countryBO": "Bolivia",
                "countryBA": "Bosnia and Herzegovina",
                "countryBW": "Botswana",
                "countryBV": "Bouvet Island",
                "countryBR": "Brazil",
                "countryIO": "British Indian Ocean Territory",
                "countryVG": "British Virgin Islands",
                "countryBN": "Brunei",
                "countryBG": "Bulgaria",
                "countryBF": "Burkina Faso",
                "countryBI": "Burundi",
                "countryKH": "Cambodia",
                "countryCM": "Cameroon",
                "countryCA": "Canada",
                "countryCV": "Cape Verde",
                "countryKY": "Cayman Islands",
                "countryCF": "Central African Republic",
                "countryTD": "Chad",
                "countryCL": "Chile",
                "countryCN": "China",
                "countryCX": "Christmas Island",
                "countryCC": "Cocos (Keeling) Islands",
                "countryCO": "Colombia",
                "countryKM": "Comoros",
                "countryCG": "Congo - Brazzaville",
                "countryCD": "Congo - Kinshasa",
                "countryCK": "Cook Islands",
                "countryCR": "Costa Rica",
                "countryCI": "Côte d’Ivoire",
                "countryHR": "Croatia",
                "countryCU": "Cuba",
                "countryCY": "Cyprus",
                "countryCZ": "Czechia",
                "countryDK": "Denmark",
                "countryDJ": "Djibouti",
                "countryDM": "Dominica",
                "countryDO": "Dominican Republic",
                "countryEC": "Ecuador",
                "countryEG": "Egypt",
                "countrySV": "El Salvador",
                "countryGQ": "Equatorial Guinea",
                "countryER": "Eritrea",
                "countryEE": "Estonia",
                "countrySZ": "Eswatini",
                "countryET": "Ethiopia",
                "countryFK": "Falkland Islands (Islas Malvinas)",
                "countryFO": "Faroe Islands",
                "countryFJ": "Fiji",
                "countryFI": "Finland",
                "countryFR": "France",
                "countryGF": "French Guiana",
                "countryPF": "French Polynesia",
                "countryTF": "French Southern Territories",
                "countryGA": "Gabon",
                "countryGM": "Gambia",
                "countryGE": "Georgia",
                "countryDE": "Germany",
                "countryGH": "Ghana",
                "countryGI": "Gibraltar",
                "countryGR": "Greece",
                "countryGL": "Greenland",
                "countryGD": "Grenada",
                "countryGP": "Guadeloupe",
                "countryGU": "Guam",
                "countryGT": "Guatemala",
                "countryGN": "Guinea",
                "countryGW": "Guinea-Bissau",
                "countryGY": "Guyana",
                "countryHT": "Haiti",
                "countryHM": "Heard and McDonald Islands",
                "countryHN": "Honduras",
                "countryHK": "Hong Kong",
                "countryHU": "Hungary",
                "countryIS": "Iceland",
                "countryIN": "India",
                "countryID": "Indonesia",
                "countryIR": "Iran",
                "countryIQ": "Iraq",
                "countryIE": "Ireland",
                "countryIL": "Israel",
                "countryIT": "Italy",
                "countryJM": "Jamaica",
                "countryJP": "Japan",
                "countryJO": "Jordan",
                "countryKZ": "Kazakhstan",
                "countryKE": "Kenya",
                "countryKI": "Kiribati",
                "countryKW": "Kuwait",
                "countryKG": "Kyrgyzstan",
                "countryLA": "Laos",
                "countryLV": "Latvia",
                "countryLB": "Lebanon",
                "countryLS": "Lesotho",
                "countryLR": "Liberia",
                "countryLY": "Libya",
                "countryLI": "Liechtenstein",
                "countryLT": "Lithuania",
                "countryLU": "Luxembourg",
                "countryMO": "Macao",
                "countryMG": "Madagascar",
                "countryMW": "Malawi",
                "countryMY": "Malaysia",
                "countryMV": "Maldives",
                "countryML": "Mali",
                "countryMT": "Malta",
                "countryMH": "Marshall Islands",
                "countryMQ": "Martinique",
                "countryMR": "Mauritania",
                "countryMU": "Mauritius",
                "countryYT": "Mayotte",
                "countryMX": "Mexico",
                "countryFM": "Micronesia",
                "countryMD": "Moldova",
                "countryMC": "Monaco",
                "countryMN": "Mongolia",
                "countryMS": "Montserrat",
                "countryMA": "Morocco",
                "countryMZ": "Mozambique",
                "countryMM": "Myanmar (Burma)",
                "countryNA": "Namibia",
                "countryNR": "Nauru",
                "countryNP": "Nepal",
                "countryNL": "Netherlands",
                "countryNC": "New Caledonia",
                "countryNZ": "New Zealand",
                "countryNI": "Nicaragua",
                "countryNE": "Niger",
                "countryNG": "Nigeria",
                "countryNU": "Niue",
                "countryNF": "Norfolk Island",
                "countryKP": "North Korea",
                "countryMK": "North Macedonia",
                "countryMP": "Northern Mariana Islands",
                "countryNO": "Norway",
                "countryOM": "Oman",
                "countryPK": "Pakistan",
                "countryPW": "Palau",
                "countryPS": "Palestine",
                "countryPA": "Panama",
                "countryPG": "Papua New Guinea",
                "countryPY": "Paraguay",
                "countryPE": "Peru",
                "countryPH": "Philippines",
                "countryPN": "Pitcairn Islands",
                "countryPL": "Poland",
                "countryPT": "Portugal",
                "countryPR": "Puerto Rico",
                "countryQA": "Qatar",
                "countryRE": "Réunion",
                "countryRO": "Romania",
                "countryRU": "Russia",
                "countryRW": "Rwanda",
                "countryWS": "Samoa",
                "countrySM": "San Marino",
                "countryST": "São Tomé and Príncipe",
                "countrySA": "Saudi Arabia",
                "countrySN": "Senegal",
                "countryRS": "Serbia",
                "countrySC": "Seychelles",
                "countrySL": "Sierra Leone",
                "countrySG": "Singapore",
                "countrySK": "Slovakia",
                "countrySI": "Slovenia",
                "countrySB": "Solomon Islands",
                "countrySO": "Somalia",
                "countryZA": "South Africa",
                "countryGS": "South Georgia and South Sandwich Islands",
                "countryKR": "South Korea",
                "countryES": "Spain",
                "countryLK": "Sri Lanka",
                "countrySH": "St. Helena",
                "countryKN": "St. Kitts and Nevis",
                "countryLC": "St. Lucia",
                "countryPM": "St. Pierre and Miquelon",
                "countryVC": "St. Vincent and Grenadines",
                "countrySD": "Sudan",
                "countrySR": "Suriname",
                "countrySJ": "Svalbard and Jan Mayen",
                "countrySE": "Sweden",
                "countryCH": "Switzerland",
                "countrySY": "Syria",
                "countryTW": "Taiwan",
                "countryTJ": "Tajikistan",
                "countryTZ": "Tanzania",
                "countryTH": "Thailand",
                "countryTG": "Togo",
                "countryTK": "Tokelau",
                "countryTO": "Tonga",
                "countryTT": "Trinidad and Tobago",
                "countryTN": "Tunisia",
                "countryTR": "Turkey",
                "countryTM": "Turkmenistan",
                "countryTC": "Turks and Caicos Islands",
                "countryTV": "Tuvalu",
                "countryUM": "U.S. Outlying Islands",
                "countryVI": "U.S. Virgin Islands",
                "countryUG": "Uganda",
                "countryUA": "Ukraine",
                "countryAE": "United Arab Emirates",
                "countryGB": "United Kingdom",
                "countryUS": "United States",
                "countryUY": "Uruguay",
                "countryUZ": "Uzbekistan",
                "countryVU": "Vanuatu",
                "countryVA": "Vatican City",
                "countryVE": "Venezuela",
                "countryVN": "Vietnam",
                "countryWF": "Wallis and Futuna",
                "countryEH": "Western Sahara",
                "countryYE": "Yemen",
                "countryZM": "Zambia",
                "countryZW": "Zimbabwe"
            }
        }
    )
    contry: string;

}

/*

@ClassInfo({
    key: 'text-search',
    description:'text'
})
export class Text extends GeneralSearch
{

}

@ClassInfo({
    key: 'image-search',
    description:'images'
})
export class Images extends GeneralSearch
{
    @FieldInfo({
        key: imageSizeKey,
        description:  ["size"],
        domain: { // Cisz
            'Cisz:i' : ['icon', 'tiny','small'],
            'Cisz:m' : 'medium',
            'Cisz:l' : 'large'
        }
    })
    imageSize:string;

    @FieldInfo({
        key: imageColorKey,
        description:  ["color"],
        domain: { // Cisz
            'ic:trans' : 'transparent',
            'ic:specific,Cisc:red' : 'red',
            'ic:specific,Cisc:orange' : 'orange',
            'ic:specific,Cisc:yellow' : 'yellow',
            'ic:specific,Cisc:green' : 'green',
            'ic:specific,Cisc:teal' : 'teal',
            'ic:specific,Cisc:blue' : 'blue',
            'ic:specific,Cisc:pink' : 'pink',
            'ic:specific,Cisc:purple' : 'purple',
            'ic:specific,Cisc:white' : 'white',
            'ic:specific,Cisc:gray' : 'gray',
            'ic:specific,Cisc:black' : 'black',
            'ic:specific,Cisc:brown' : 'brown',
        }
    })
    imageColor:string;

    @FieldInfo({
        key: imageTypeKey,
        description:  ["image type"],
        domain: {
            'Citp:clipart' : ['clip art','clipart'],
            'Citp:lineart' : ['line art','lineart'],
            'Citp:gif' : ['gif','animation'],
        }
    })
    imageType:string;

    @FieldInfo({
        key: imageLicenseKey,
        description:  ["image type"],
        domain: {
            'Cil:cl' : 'Creative Common license',
            'Citp:ol' : 'Commercial licenses'
        }
    })
    imageLicense:string;

}

@ClassInfo({
    key: 'shopping-search',
    description:'shopping'
})
export class Shopping extends GeneralSearch
{

}

@ClassInfo({
    key: 'news-search',
    description:'news'
})
export class News extends GeneralSearch
{

}*/

