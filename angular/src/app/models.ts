export interface Job {
    id: string
    title: string
    company_name: string
    category: string
    job_type: string
    candidate_required_location: string[]
    description: string
    company_logo: string
    publication_date: Date
    promoted: boolean
    promoted_time: Date
    tags: string[]
}

export interface Applicant {
    id?: string
    firstName: string
    lastName: string
    email: string
    password?: string
    headline?: string
    resume?: string
    location?: string
    profile_pic?: string
    applied_date?: Date | undefined
}

export interface Business {
    id?: string
    company_name: string
    company_email?: string
    password?: string
    premium: boolean
    logo?: string
}

export const NO_APPLICANT: Applicant = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
}

export interface SideNavRoute {
    route: string
    label: string
    matIconName: string
    notification?: boolean; 
}

export interface LoginUser {
    email: string
    password: string
    role: string

}

export interface JobFilter {
    search: string
    type: string
}

export interface JobPost {
    id?: string
    title: string
    job_type: string
    description: string
    company_name: string
    company_logo?: string
    candidate_required_location?: string[]
    tags?: string[]
}

export interface JobStat {
    id: number
    title: string
    company_name: string
    applied: number
    saved: number
    publication_date: Date
    last_updated: Date
    last_seen: Date
    promoted: boolean
    notif?: boolean 
}

export interface JobList {
    jobs: Job[]
}

export interface PaymentInfo {
    successUrl: string
    cancelUrl: string
}

export interface Employment {
    id?: string
    title: string
    company: string
    job_description: string
    location: string,
    job_type: string,
    location_type: string,
    start_month: string,
    start_year: string,
    end_month: string,
    end_year: string,
    current_role: boolean
}

export interface Skill {
    id: number
    skill_name: string
}

export interface AppliedJob {
    id: string
    title: string
    company_name: string
    category: string
    job_type: string
    candidate_required_location: string[]
    description: string
    company_logo: string
    publication_date: Date
    tags: string[]
    appliedDateTime: Date
}

export interface EachApplicantSearch {
    id?: string
    firstName: string
    lastName: string
    email: string
    headline?: string
    resume?: string
    location?: string
    profile_pic?: string
    skills?: Skill[]
    employments?: Employment[]
}

export interface SearchList {
    applicants: EachApplicantSearch[]
}
