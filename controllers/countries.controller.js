const countries = [
  { code: "AF", name: "Afghanistan", flag: "🇦🇫", phoneCode: "+93" },
  { code: "AL", name: "Albania", flag: "🇦🇱", phoneCode: "+355" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿", phoneCode: "+213" },
  { code: "AS", name: "American Samoa", flag: "🇦🇸", phoneCode: "+1684" },
  { code: "AD", name: "Andorra", flag: "🇦🇩", phoneCode: "+376" },
  { code: "AO", name: "Angola", flag: "🇦🇴", phoneCode: "+244" },
  { code: "AI", name: "Anguilla", flag: "🇦🇮", phoneCode: "+1264" },
  { code: "AQ", name: "Antarctica", flag: "🇦🇶", phoneCode: "+672" },
  { code: "AG", name: "Antigua and Barbuda", flag: "🇦🇬", phoneCode: "+1268" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", phoneCode: "+54" },
  { code: "AM", name: "Armenia", flag: "🇦🇲", phoneCode: "+374" },
  { code: "AW", name: "Aruba", flag: "🇦🇼", phoneCode: "+297" },
  { code: "AU", name: "Australia", flag: "🇦🇺", phoneCode: "+61" },
  { code: "AT", name: "Austria", flag: "🇦🇹", phoneCode: "+43" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿", phoneCode: "+994" },
  { code: "BS", name: "Bahamas", flag: "🇧🇸", phoneCode: "+1242" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭", phoneCode: "+973" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", phoneCode: "+880" },
  { code: "BB", name: "Barbados", flag: "🇧🇧", phoneCode: "+1246" },
  { code: "BY", name: "Belarus", flag: "🇧🇾", phoneCode: "+375" },
  { code: "BE", name: "Belgium", flag: "🇧🇪", phoneCode: "+32" },
  { code: "BZ", name: "Belize", flag: "🇧🇿", phoneCode: "+501" },
  { code: "BJ", name: "Benin", flag: "🇧🇯", phoneCode: "+229" },
  { code: "BM", name: "Bermuda", flag: "🇧🇲", phoneCode: "+1441" },
  { code: "BT", name: "Bhutan", flag: "🇧🇹", phoneCode: "+975" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴", phoneCode: "+591" },
  { code: "BA", name: "Bosnia and Herzegovina", flag: "🇧🇦", phoneCode: "+387" },
  { code: "BW", name: "Botswana", flag: "🇧🇼", phoneCode: "+267" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", phoneCode: "+55" },
  { code: "BN", name: "Brunei", flag: "🇧🇳", phoneCode: "+673" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬", phoneCode: "+359" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫", phoneCode: "+226" },
  { code: "BI", name: "Burundi", flag: "🇧🇮", phoneCode: "+257" },
  { code: "CV", name: "Cabo Verde", flag: "🇨🇻", phoneCode: "+238" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭", phoneCode: "+855" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲", phoneCode: "+237" },
  { code: "CA", name: "Canada", flag: "🇨🇦", phoneCode: "+1" },
  { code: "KY", name: "Cayman Islands", flag: "🇰🇾", phoneCode: "+1345" },
  { code: "CF", name: "Central African Republic", flag: "🇨🇫", phoneCode: "+236" },
  { code: "TD", name: "Chad", flag: "🇹🇩", phoneCode: "+235" },
  { code: "CL", name: "Chile", flag: "🇨🇱", phoneCode: "+56" },
  { code: "CN", name: "China", flag: "🇨🇳", phoneCode: "+86" },
  { code: "CO", name: "Colombia", flag: "🇨🇴", phoneCode: "+57" },
  { code: "KM", name: "Comoros", flag: "🇰🇲", phoneCode: "+269" },
  { code: "CG", name: "Congo", flag: "🇨🇬", phoneCode: "+242" },
  { code: "CD", name: "Congo (Democratic Republic)", flag: "🇨🇩", phoneCode: "+243" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷", phoneCode: "+506" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮", phoneCode: "+225" },
  { code: "HR", name: "Croatia", flag: "🇭🇷", phoneCode: "+385" },
  { code: "CU", name: "Cuba", flag: "🇨🇺", phoneCode: "+53" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾", phoneCode: "+357" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿", phoneCode: "+420" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", phoneCode: "+45" },
  { code: "DJ", name: "Djibouti", flag: "🇩🇯", phoneCode: "+253" },
  { code: "DM", name: "Dominica", flag: "🇩🇲", phoneCode: "+1767" },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴", phoneCode: "+1809" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨", phoneCode: "+593" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", phoneCode: "+20" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻", phoneCode: "+503" },
  { code: "GQ", name: "Equatorial Guinea", flag: "🇬🇶", phoneCode: "+240" },
  { code: "ER", name: "Eritrea", flag: "🇪🇷", phoneCode: "+291" },
  { code: "EE", name: "Estonia", flag: "🇪🇪", phoneCode: "+372" },
  { code: "SZ", name: "Eswatini", flag: "🇸🇿", phoneCode: "+268" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹", phoneCode: "+251" },
  { code: "FJ", name: "Fiji", flag: "🇫🇯", phoneCode: "+679" },
  { code: "FI", name: "Finland", flag: "🇫🇮", phoneCode: "+358" },
  { code: "FR", name: "France", flag: "🇫🇷", phoneCode: "+33" },
  { code: "GA", name: "Gabon", flag: "🇬🇦", phoneCode: "+241" },
  { code: "GM", name: "Gambia", flag: "🇬🇲", phoneCode: "+220" },
  { code: "GE", name: "Georgia", flag: "🇬🇪", phoneCode: "+995" },
  { code: "DE", name: "Germany", flag: "🇩🇪", phoneCode: "+49" },
  { code: "GH", name: "Ghana", flag: "🇬🇭", phoneCode: "+233" },
  { code: "GR", name: "Greece", flag: "🇬🇷", phoneCode: "+30" },
  { code: "GD", name: "Grenada", flag: "🇬🇩", phoneCode: "+1473" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹", phoneCode: "+502" },
  { code: "GN", name: "Guinea", flag: "🇬🇳", phoneCode: "+224" },
  { code: "GW", name: "Guinea-Bissau", flag: "🇬🇼", phoneCode: "+245" },
  { code: "GY", name: "Guyana", flag: "🇬🇾", phoneCode: "+592" },
  { code: "HT", name: "Haiti", flag: "🇭🇹", phoneCode: "+509" },
  { code: "HN", name: "Honduras", flag: "🇭🇳", phoneCode: "+504" },
  { code: "HU", name: "Hungary", flag: "🇭🇺", phoneCode: "+36" },
  { code: "IS", name: "Iceland", flag: "🇮🇸", phoneCode: "+354" },
  { code: "IN", name: "India", flag: "🇮🇳", phoneCode: "+91" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", phoneCode: "+62" },
  { code: "IR", name: "Iran", flag: "🇮🇷", phoneCode: "+98" },
  { code: "IQ", name: "Iraq", flag: "🇮🇶", phoneCode: "+964" },
  { code: "IE", name: "Ireland", flag: "🇮🇪", phoneCode: "+353" },
  { code: "IL", name: "Israel", flag: "🇮🇱", phoneCode: "+972" },
  { code: "IT", name: "Italy", flag: "🇮🇹", phoneCode: "+39" },
  { code: "JM", name: "Jamaica", flag: "🇯🇲", phoneCode: "+1876" },
  { code: "JP", name: "Japan", flag: "🇯🇵", phoneCode: "+81" },
  { code: "JO", name: "Jordan", flag: "🇯🇴", phoneCode: "+962" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿", phoneCode: "+7" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", phoneCode: "+254" },
  { code: "KI", name: "Kiribati", flag: "🇰🇮", phoneCode: "+686" },
  { code: "KP", name: "Korea (North)", flag: "🇰🇵", phoneCode: "+850" },
  { code: "KR", name: "Korea (South)", flag: "🇰🇷", phoneCode: "+82" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼", phoneCode: "+965" },
  { code: "KG", name: "Kyrgyzstan", flag: "🇰🇬", phoneCode: "+996" },
  { code: "LA", name: "Laos", flag: "🇱🇦", phoneCode: "+856" },
  { code: "LV", name: "Latvia", flag: "🇱🇻", phoneCode: "+371" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧", phoneCode: "+961" },
  { code: "LS", name: "Lesotho", flag: "🇱🇸", phoneCode: "+266" },
  { code: "LR", name: "Liberia", flag: "🇱🇷", phoneCode: "+231" },
  { code: "LY", name: "Libya", flag: "🇱🇾", phoneCode: "+218" },
  { code: "LI", name: "Liechtenstein", flag: "🇱🇮", phoneCode: "+423" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹", phoneCode: "+370" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺", phoneCode: "+352" },
  { code: "MG", name: "Madagascar", flag: "🇲🇬", phoneCode: "+261" },
  { code: "MW", name: "Malawi", flag: "🇲🇼", phoneCode: "+265" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", phoneCode: "+60" },
  { code: "MV", name: "Maldives", flag: "🇲🇻", phoneCode: "+960" },
  { code: "ML", name: "Mali", flag: "🇲🇱", phoneCode: "+223" },
  { code: "MT", name: "Malta", flag: "🇲🇹", phoneCode: "+356" },
  { code: "MH", name: "Marshall Islands", flag: "🇲🇭", phoneCode: "+692" },
  { code: "MR", name: "Mauritania", flag: "🇲🇷", phoneCode: "+222" },
  { code: "MU", name: "Mauritius", flag: "🇲🇺", phoneCode: "+230" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", phoneCode: "+52" },
  { code: "FM", name: "Micronesia", flag: "🇫🇲", phoneCode: "+691" },
  { code: "MD", name: "Moldova", flag: "🇲🇩", phoneCode: "+373" },
  { code: "MC", name: "Monaco", flag: "🇲🇨", phoneCode: "+377" },
  { code: "MN", name: "Mongolia", flag: "🇲🇳", phoneCode: "+976" },
  { code: "ME", name: "Montenegro", flag: "🇲🇪", phoneCode: "+382" },
  { code: "MA", name: "Morocco", flag: "🇲🇦", phoneCode: "+212" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿", phoneCode: "+258" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲", phoneCode: "+95" },
  { code: "NA", name: "Namibia", flag: "🇳🇦", phoneCode: "+264" },
  { code: "NR", name: "Nauru", flag: "🇳🇷", phoneCode: "+674" },
  { code: "NP", name: "Nepal", flag: "🇳🇵", phoneCode: "+977" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", phoneCode: "+31" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", phoneCode: "+64" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮", phoneCode: "+505" },
  { code: "NE", name: "Niger", flag: "🇳🇪", phoneCode: "+227" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", phoneCode: "+234" },
  { code: "MK", name: "North Macedonia", flag: "🇲🇰", phoneCode: "+389" },
  { code: "NO", name: "Norway", flag: "🇳🇴", phoneCode: "+47" },
  { code: "OM", name: "Oman", flag: "🇴🇲", phoneCode: "+968" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", phoneCode: "+92" },
  { code: "PW", name: "Palau", flag: "🇵🇼", phoneCode: "+680" },
  { code: "PS", name: "Palestine", flag: "🇵🇸", phoneCode: "+970" },
  { code: "PA", name: "Panama", flag: "🇵🇦", phoneCode: "+507" },
  { code: "PG", name: "Papua New Guinea", flag: "🇵🇬", phoneCode: "+675" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾", phoneCode: "+595" },
  { code: "PE", name: "Peru", flag: "🇵🇪", phoneCode: "+51" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", phoneCode: "+63" },
  { code: "PL", name: "Poland", flag: "🇵🇱", phoneCode: "+48" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", phoneCode: "+351" },
  { code: "QA", name: "Qatar", flag: "🇶🇦", phoneCode: "+974" },
  { code: "RO", name: "Romania", flag: "🇷🇴", phoneCode: "+40" },
  { code: "RU", name: "Russia", flag: "🇷🇺", phoneCode: "+7" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼", phoneCode: "+250" },
  { code: "KN", name: "Saint Kitts and Nevis", flag: "🇰🇳", phoneCode: "+1869" },
  { code: "LC", name: "Saint Lucia", flag: "🇱🇨", phoneCode: "+1758" },
  { code: "VC", name: "Saint Vincent and the Grenadines", flag: "🇻🇨", phoneCode: "+1784" },
  { code: "WS", name: "Samoa", flag: "🇼🇸", phoneCode: "+685" },
  { code: "SM", name: "San Marino", flag: "🇸🇲", phoneCode: "+378" },
  { code: "ST", name: "Sao Tome and Principe", flag: "🇸🇹", phoneCode: "+239" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", phoneCode: "+966" },
  { code: "SN", name: "Senegal", flag: "🇸🇳", phoneCode: "+221" },
  { code: "RS", name: "Serbia", flag: "🇷🇸", phoneCode: "+381" },
  { code: "SC", name: "Seychelles", flag: "🇸🇨", phoneCode: "+248" },
  { code: "SL", name: "Sierra Leone", flag: "🇸🇱", phoneCode: "+232" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", phoneCode: "+65" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰", phoneCode: "+421" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮", phoneCode: "+386" },
  { code: "SB", name: "Solomon Islands", flag: "🇸🇧", phoneCode: "+677" },
  { code: "SO", name: "Somalia", flag: "🇸🇴", phoneCode: "+252" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", phoneCode: "+27" },
  { code: "SS", name: "South Sudan", flag: "🇸🇸", phoneCode: "+211" },
  { code: "ES", name: "Spain", flag: "🇪🇸", phoneCode: "+34" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰", phoneCode: "+94" },
  { code: "SD", name: "Sudan", flag: "🇸🇩", phoneCode: "+249" },
  { code: "SR", name: "Suriname", flag: "🇸🇷", phoneCode: "+597" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", phoneCode: "+46" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", phoneCode: "+41" },
  { code: "SY", name: "Syria", flag: "🇸🇾", phoneCode: "+963" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼", phoneCode: "+886" },
  { code: "TJ", name: "Tajikistan", flag: "🇹🇯", phoneCode: "+992" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿", phoneCode: "+255" },
  { code: "TH", name: "Thailand", flag: "🇹🇭", phoneCode: "+66" },
  { code: "TL", name: "Timor-Leste", flag: "🇹🇱", phoneCode: "+670" },
  { code: "TG", name: "Togo", flag: "🇹🇬", phoneCode: "+228" },
  { code: "TO", name: "Tonga", flag: "🇹🇴", phoneCode: "+676" },
  { code: "TT", name: "Trinidad and Tobago", flag: "🇹🇹", phoneCode: "+1868" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳", phoneCode: "+216" },
  { code: "TR", name: "Turkey", flag: "🇹🇷", phoneCode: "+90" },
  { code: "TM", name: "Turkmenistan", flag: "🇹🇲", phoneCode: "+993" },
  { code: "TV", name: "Tuvalu", flag: "🇹🇻", phoneCode: "+688" },
  { code: "UG", name: "Uganda", flag: "🇺🇬", phoneCode: "+256" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦", phoneCode: "+380" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", phoneCode: "+971" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", phoneCode: "+44" },
  { code: "US", name: "United States", flag: "🇺🇸", phoneCode: "+1" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾", phoneCode: "+598" },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿", phoneCode: "+998" },
  { code: "VU", name: "Vanuatu", flag: "🇻🇺", phoneCode: "+678" },
  { code: "VA", name: "Vatican City", flag: "🇻🇦", phoneCode: "+39" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪", phoneCode: "+58" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", phoneCode: "+84" },
  { code: "YE", name: "Yemen", flag: "🇾🇪", phoneCode: "+967" },
  { code: "ZM", name: "Zambia", flag: "🇿🇲", phoneCode: "+260" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼", phoneCode: "+263" }
];

export const getAllCountries = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: countries.length,
      data: countries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching countries",
      error: error.message
    });
  }
};

export const getCountryByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const country = countries.find(c => c.code.toLowerCase() === code.toLowerCase());
    
    if (!country) {
      return res.status(404).json({
        success: false,
        message: "Country not found"
      });
    }

    res.status(200).json({
      success: true,
      data: country
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching country",
      error: error.message
    });
  }
};

export const searchCountries = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const filteredCountries = countries.filter(country =>
      country.name.toLowerCase().includes(q.toLowerCase()) ||
      country.code.toLowerCase().includes(q.toLowerCase()) ||
      country.phoneCode.includes(q)
    );

    res.status(200).json({
      success: true,
      count: filteredCountries.length,
      data: filteredCountries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching countries",
      error: error.message
    });
  }
};