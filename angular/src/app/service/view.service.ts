import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  static allcountries: string[] = ['Africa', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Bangladesh', 'Belgium', 'Brazil', 'Cambodia', 'Cameroon', 'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica', 'Croatia', 'Dominican Republic', 'EMEA', 'Ecuador', 'Egypt', 'El Salvador', 'Estonia', 'Europe', 'Finland', 'France', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Hong Kong', 'Hungary', 'India', 'Indonesia', 'Ireland', 'Italy', 'Japan', 'Kenya', 'Laos', 'Latvia', 'Malaysia', 'Mexico', 'Morocco', 'Nepal', 'New Zealand', 'North Macedonia', 'Northern America', 'Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Romania', 'Serbia', 'Singapore', 'Slovakia', 'South Africa', 'South America', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'UK', 'USA', 'Ukraine', 'United Arab Emirates', 'Venezuela', 'Vietnam', 'Western Europe', 'Worldwide']
  static defaultTags: string[] = ["JAVA", "INFORMATION TECHNOLOGY", "C-LEVEL", "MVVM", "FULLSTACK", "SERVICE DELIVERY", "SPARK", "CISCO", "MARKETING STRATEGY", "ORACLE", "MICROSOFT OFFICE", "INTERACTION DESIGN", "TRELLO", "DIGITAL ANALYTICS", "DELIVERY MANAGER", "OUTLOOK", "EDTECH", "GRAFANA", "CISSP", "DIVERSITY", "INSIDE SALES", "DIGITAL CONTENT", "RESEARCH", "SDR", "SPRING", "MENTORING", "SHOPIFY", "USER ACQUISITION", "AGILE", "MONGODB", "EMAIL MARKETING", "TRADING", "BUSINESS INTELLIGENCE", "PRIVACY LAWS", "DATA ANALYSIS", "JENKINS", "DATA SCIENCE", "BUSINESS OPERATIONS", "UBUNTU", "SOCIAL MEDIA", "ONBOARDING", "ESPORTS", "TENSORFLOW", "MIXPANEL", "SEM", "SEO", "CUSTOMER ACQUISITION", "SOLID", "POSTGRESQL", "DIGITAL DESIGN", "APACHE", "AJAX", "C#", "PPC", "C", "MARKETING AUTOMATION", "FUSION", "LEAD GENERATION", "ACCOUNT MANAGEMENT", "ANALYTICS", "GRAPHQL", "CCPA", "SKETCH", "OBJECTIVE-C", "PROTOTYPING", "R", "PIPEDRIVE", "BITCOIN", "NLP", "SEMRUSH", "BIG DATA", "PROGRAM MANAGER", "BUSINESS MANAGEMENT", "SUPPLY CHAIN", "ASO", "TABLEAU", "MS OFFICE", "FACEBOOK ADS", "FEDRAMP", "HEALTHCARE", "STATISTICS", "NODE.JS", "MARKETPLACE", "TECHNICAL SUPPORT", "PRODUCT STRATEGY", "BACKEND", "IT SUPPORT", "HARDWARE", "CX", "RISK MANAGEMENT", "REDUX", "SECURITY", "AUTOMATION", "FINANCIAL SERVICES", "JQUERY", "ERLANG", "FRONTEND", "ATS", "SAAS SALES", "TROUBLESHOOTING", "DEBUGGING", "APPLE", "REVENUE MARKETING", "VIDEO", "ZENDESK", "ADVERTISING", "GOOGLE SUITE", "MEDIA PLANNING", "CYBERSECURITY", "WEBPACK", "GOOGLE ANALYTICS", "ELEARNING", "G SUITE", "OUTBOUND SALES/MARKETING", "VMWARE", "BUSINESS DEVELOPMENT", "RESPONSIVE", ".NET", "PBM", "ADMIN", "DATA VISUALIZATION", "COMMUNITY MANAGEMENT", "F#", "DEEP LEARNING", "A/B TESTING", "DEMAND GENERATION", "DIGITAL ADVERTISING", "DOCKER", "SHELL", "PRODUCT SECURITY", "THEMES", "LINUX/UNIX", "MAGENTO", "GAAP", "CLOJURE", "DATA SECURITY", "SCRUM", "MARKETING OPERATIONS", "YOUTUBE", "GAME DESIGN", "BIGQUERY", "BANKING", "COMPUTER SCIENCE", "OPERATING SYSTEMS", "GITHUB", "MS PROJECT", "GOOGLE CLOUD", "DATA ENGINEERING", "ADOBE PHOTOSHOP", "DOCUMENTATION", "PRESALES", "HUBSPOT", "ILLUSTRATOR", "IT SYSTEMS", "NEXT.JS", "PROJECT MANAGEMENT", "INSURANCE", "PERL", "JSON", "BASH", "CONTENT MARKETING", "SPLUNK", "WEB APPLICATIONS", "DIRECT SALES", "VPN", "RELAY", "TEAM LEAD", "PAID MEDIA", "TLS", "AWS", "PRODUCT MARKETING", "PACKAGING", "ANDROID SDK", "C++", "RETAIL", "TRAVEL", "MYSQL", "SDET", "SALESFORCE", "GO", "TEST AUTOMATION", "INSTRUCTIONAL DESIGN", "TICKETING", "WEBRTC", "SELENIUM", "PEOPLE OPERATIONS", "PAYROLL", "STEM", "OPENAPI", "PERFORMANCE MARKETING", "DATA WAREHOUSING", "SITE RELIABILITY", "KAFKA", "EDITING", "ANDROID", "PRODUCT OWNER", "BACKBONE", "APEX", "JAVASCRIPT", "DEBIAN", "MARKETO", "SALES DEVELOPMENT", "SERVERLESS", "CHAT", "GOOGLE ADS", "SWIFT", "ES6", "PYTHON", "WORDPRESS", "FUNDRAISING", "ATTORNEY", "AI/ML", "TEAM MANAGEMENT", "PHP", "ANSIBLE", "REACT JS", "DIGITAL MEDIA", "MOBILE DEVELOPMENT", "VUE.JS", "REACT NATIVE", "EXCEL", "PRODUCT DEVELOPMENT", "TECHNICAL WRITING", "GOOGLE DOCS", "ADOBE SUITE", "ENTERPRISE SALES", "IAAS", "QUAL", "MSP", "MAINNET", "LINGUISTICS", "GOLANG", "BOOTSTRAP", "CPA", "CI/CD", "WORKDAY", "SNOWFLAKE", "ETL", "MEDICAL IMAGING", "DATABASE ADMIN", "KOTLIN", "TYPESCRIPT", "NETWORK PROTOCOLS", "INTERCOM", "FIGMA", "METABASE", "SYSTEM ADMINISTRATION", "UNITY", "EVENT MANAGEMENT", "MENTAL HEALTH", "HTML", "JIRA", "PRODUCT MANAGEMENT", "PHOTOSHOP", "HRIS", "SCALA", "NONPROFIT", "DATA ENTRY", "ACCOUNTING", "BLOCKCHAIN", "RUBY/RAILS", "ROBOTICS", "SQA", "CAMPAIGN MANAGEMENT", "WAREHOUSE", "MARKET RESEARCH", "CAD", "ADOBE ILLUSTRATOR", "VISUAL DESIGN", "SDLC", "SQL", "DIGITAL MARKETING", "GIT", "HASKELL", "CAMPAIGN DEVELOPMENT", "BRAND DESIGN", "APOLLO", "CONTENT STRATEGY", "IT CONSULTING", "MICRO SERVICES", "MANUAL TESTING", "CRM", "BUSINESS ANALYSIS", "CRYPTO", "WEB ANALYTICS", "NETSUITE", "CRO", "RELATIONAL DATABASES", "RUST", "CYPRESS", "SAP", "CLOUD", "PAAS", "SRE", "TIME MANAGEMENT", "BOOKKEEPING", "OPEN SOURCE", "AZURE", "AUTOCAD", "GAME WRITING", "TDD", "TREASURY", "TEACHING", "POSTMAN", "CSS", "SOFTWARE SYSTEMS", "PYTORCH", "DEI", "SCRIPTING", "STARTUP", "IOS", "PMI", "SYSTEM ARCHITECTURE", "IOT", "TECHNICAL DOCUMENTATION", "QUICKBOOKS", "REST", "TESTING", "XML", "KUBERNETES", "SOFTWARE SALES", "REDIS", "ASANA", "API", "ELASTICSEARCH", "ETHEREUM", "REACT"]

  static months: string[] = ["January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"]
  static years: string[] = []


  static getTimeDifference(date: Date) {
    const now = new Date();
    const loaded = new Date(date);
    const diffMs = now.getTime() - loaded.getTime();

    // Calculate difference in seconds, minutes, hours, days
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
  }

  static getCountryList(): string[] {
    return this.allcountries;
  }

  static getMonths(): string[] {
    return this.months
  }

  static getYears(): string[] {
    const currentYear = new Date().getFullYear(); 
    for (let year = 1924; year <= currentYear; year++) {
      this.years.push(year.toString());
    }
    return this.years.reverse()
  }

}
