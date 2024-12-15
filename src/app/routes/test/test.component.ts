import { Component } from '@angular/core';

interface WorkHistory {
  title: string;
  company: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  location: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  summary: string;
  bullets?: string[];
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.sass',
})
export class TestComponent {
  constructor() {
    console.log('TestComponent');
  }

  skills: string[] = ['HTML/CSS', 'AWS', 'Angular', 'TypeScript', 'Node.js', 'MySQL', 'RESTful API', 'GraphQL'];

  workHistory: WorkHistory[] = [
    {
      title: 'Junior Engineer',
      company: 'WebBuy',
      type: 'Full-time',
      location: 'Remote',
      technologies: ['AWS', 'Microservice architecture', 'MySQL', 'TypeScript', 'Angular', 'Node.js'],
      startDate: 'Jan 2023',
      endDate: '',
      summary: 'Effectively manages increasing responsibilities and communications with WebBuy products and team.',
      bullets: [
        'Implemented 100% of customer back-facing application updates from V2 to V3.',
        'Outperformed peers by 10 days delivering version updates from Node14 to 20 and Angular12 to 17.',
        'Developed and maintained 3 internal tools, reducing team workload by 30%.',
        'Streamlined high-traffic feature, eliminated excessive API calls, measurably reducing operation costs.',
        'Invented internal-user tools, improving moral, reducing dev and non-dev workloads.',
      ],
    },
    {
      title: 'Quality Engineer',
      company: 'WebBuy',
      type: 'Full-time',
      location: 'Remote',
      technologies: ['Cypress', 'JavaScript', 'HTML/CSS', 'MySQL', 'Git'],
      startDate: 'May 2022',
      endDate: 'Jan 2023',
      summary:
        'Collaborated with the team during agile sprint cycles stages. Resolved bugs and engineered new Cypress testing. Leveraged previous support experience in code reviews providing valuable feedback. Mentored replacement hires',
    },
    {
      title: 'Support Technician',
      company: 'WebBuy',
      type: 'Part-time',
      location: 'Billings, MT',
      technologies: ['Jira', 'Excel', 'Java', 'Selenium', 'HTML/CSS'],
      startDate: 'Jul 2018',
      endDate: 'May 2022',
      summary:
        'Established and managed the support department for startup WebBuy. Duties included installations, button designs, mitigating product limitations, pricing resolutions, interface assistance and general inquiries, ultimately lead to increased customer satisfaction and retention rates.',
      bullets: ['Developed automation for lead matching used to gauge WebBuy product success'],
    },
    {
      title: '2W0 - Munitions Specialist',
      company: 'United States Air Force',
      type: 'Contract',
      location: 'Various',
      technologies: ['Excel', 'Outlook', 'Word'],
      startDate: 'Jun 2012',
      endDate: 'Jun 2018',
      summary:
        'Functioned in ever increasing responsibility roles for the delivery munitions to a fleet of aircraft. Rose from Flightline Delivery Crew Chief, to Plans and Scheduler, Vehicle Control Official, Storage Crew Chief, and finally Munitions Controller. All positions required accurate record keeping, following established procedures, providing clear communications, ensuring safety protocols, providing appropriate supervision and following command chain. Served at multiple US bases, received The Global War on Terrorism Expeditionary Medal, and honorable discharge at E4 rank.',
    },
  ];

  joinArray(arr: string[]): string {
    return arr.join(' • ');
  }

  date(job: WorkHistory) {
    const { startDate, endDate } = job;

    //parse start and end dates formatted like: Jan 2018, get the difference in month and years and join together start - end - delta
    const parseDate = (dateStr: string): Date => {
      const [month, year] = dateStr.split(' ');
      return new Date(`${month} 1, ${year}`);
    };

    const startDateObj = parseDate(startDate);
    const endDateObj = endDate ? parseDate(endDate) : new Date();

    const diffYears = endDateObj.getFullYear() - startDateObj.getFullYear();
    const diffMonths = endDateObj.getMonth() - startDateObj.getMonth() + (diffYears * 12);

    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;

    const str1 = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : ''
    const str2 = months > 0 ? `${months} mo${months > 1 ? 's' : ''}` : '';

    return `${startDate} - ${endDate || 'Present'} • ${str1} ${str2}`;
  }

  log(value: any) {
    console.log(value);
  }
}
