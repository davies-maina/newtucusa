interface Opportunity {
    name: string;
    link: string;
    desc:string;
  }
const opportunities:Opportunity[] = [
    {
    name: 'Burseries and Schorlaships',
    link: '/schorlaships',
    desc: 'Includes the county govt., NGO\'s & CDF'
    },
    {
    name: 'Internships',
    link: '/internships',
    desc: 'Includes the county govt., NGO\'s & Local CBO\'s'
    },
    {
    name: 'Job offers',
    link: '/jobs',
    desc: 'Includes the National govt.,county govt. & NGO\'s'
    },
]
export default opportunities
