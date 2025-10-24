import { Event } from '../types/Event';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2023',
    date: new Date('2023-12-01'),
    time: '10:00 AM',
    description: 'A comprehensive conference covering the latest trends in technology, including AI, blockchain, and software development.',
    location: 'San Francisco, CA'
  },
  {
    id: '2',
    title: 'Music Festival',
    date: new Date('2023-12-05'),
    time: '6:00 PM',
    description: 'An outdoor music festival featuring various artists and bands.',
    location: 'Los Angeles, CA'
  },
  {
    id: '3',
    title: 'Art Exhibition',
    date: new Date('2023-12-10'),
    time: '9:00 AM',
    description: 'Showcasing contemporary art from local and international artists.',
    location: 'New York, NY'
  },
  {
    id: '4',
    title: 'Startup Pitch Event',
    date: new Date('2023-12-15'),
    time: '2:00 PM',
    description: 'Entrepreneurs pitch their ideas to investors and the public.',
    location: 'Austin, TX'
  },
  {
    id: '5',
    title: 'Food Truck Rally',
    date: new Date('2023-12-20'),
    time: '11:00 AM',
    description: 'A gathering of food trucks offering diverse cuisines.',
    location: 'Chicago, IL'
  }
];
