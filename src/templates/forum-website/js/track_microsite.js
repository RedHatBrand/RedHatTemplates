/**
 * track_microsite.js
 * To be used on redhat.com microsites and landing pages.
 * NOTE: make sure to appropriately set s.rh_pageType on page code.
 * Variables reported to Adobe Analytics:
 * 	-pageName
 *	-server
 *	-channel
 *	-first minor section
 *	-second minor section (if available)
 *	-third minor section (if available)
 *	-full URL (domain + path + query string)
 *	-base URL (domain + path)
 *	-language
 *	-country
 **/
 
// Normalize variables from legacy implementations
if ((typeof pageType != "undefined") && (typeof s.rh_pageType == "undefined")) {
	s.rh_pageType = pageType;
}

// Default pageType to microsite if not set on page
if (typeof s.rh_pageType != "undefined") {
	if (s.rh_pageType == "") {
		s.rh_pageType = "microsite";
	}
} else {
	s.rh_pageType = "microsite";
}

s.rh_coreUrl = encodeURI(location.hostname+location.pathname).toLowerCase();
s.rh_urlSplit = s.rh_coreUrl.toLowerCase().split(/\//);
s.rh_urlLast = s.rh_urlSplit[s.rh_urlSplit.length-1];
s.rh_pageNameString = "";
s.rh_minorSectionIndex = 1;

// Default rh_language to en if not set on page or in URL
// If set in URL and index provided, set to URL value and remove from urlSplit
if (typeof s.rh_language != "undefined") {
	if (s.rh_language == "") {
		s.rh_language = "en";
	}
} else if (!isNaN(s.rh_languageCodeIndex)) {
	s.rh_language = s.rh_urlSplit.splice(parseInt(s.rh_languageCodeIndex)+s.rh_minorSectionIndex,1);
} else {
	s.rh_language = "en";
}

// Default rh_country to us if not set on page or in URL
if (typeof s.rh_country != "undefined") {
	if (s.rh_country == "") {
		s.rh_country = "us";
	}
} else {
	s.rh_country = "us";
}

// Ignore promo in URL when setting minor sections
if (s.rh_urlSplit[s.rh_minorSectionIndex] == "promo") {
	s.rh_minorSectionIndex++;
}

// If last value in urlSplit is empty, remove
if (s.rh_urlLast == "") {
	s.rh_urlSplit.splice(-1,1);
}

// Handle extensions in last value of urlSplit
if (s.rh_urlLast.search(/\./) >= 0) {
	if (s.rh_urlLast == "index.html") {
		s.rh_urlSplit.splice(-1,1);
	} else {
		s.rh_urlSplit[s.rh_urlSplit.length-1] = s.rh_urlLast.split(".").splice(0,1);
	}
}

// Insert siteName to urlSplit if set on page -- to account for non-redhat.com domains
if (typeof s.rh_siteName != "undefined") {
	s.rh_urlSplit.splice(s.rh_minorSectionIndex,0,s.rh_siteName);
}

// Set Adobe Analytics variables
s.prop14 = s.eVar27 = s.rh_urlSplit[s.rh_minorSectionIndex] || "";
s.prop15 = s.eVar28 = s.rh_urlSplit[s.rh_minorSectionIndex+1] || "";
s.prop16 = s.eVar29 = s.rh_urlSplit[s.rh_minorSectionIndex+2] || "";
s.rh_pageNameString = s.rh_urlSplit.splice(s.rh_minorSectionIndex).join(" | ");
s.pageName = "rh | " + s.rh_pageType + " | " + s.rh_pageNameString;
s.channel = s.rh_pageType;
s.prop4 = s.eVar23 = encodeURI(document.URL);
s.prop21 = s.eVar18 = s.rh_coreUrl;
s.prop2 = s.eVar22 = s.rh_language;
s.prop3 = s.eVar19 = s.rh_country;

