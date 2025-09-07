export const DEFAULT_MESSAGE_TEMPLATES = [
  {
    name: "Initial Contact",
    content:
      "Hi #{firstName} 😊. I saw you were interested in personal training. Would love to chat about your fitness goals. Give me a call back when you get the chance. Cheers!",
    sortOrder: 1,
  },
  {
    name: "Follow Up",
    content:
      "Hi #{firstName} 😊. Just following up on my previous message about training. Would love to help you reach your goals. Call me back when you're free!",
    sortOrder: 2,
  },
  {
    name: "Consultation Reminder",
    content:
      "Hi #{firstName} 😊. Just a friendly reminder about your consultation today. Looking forward to discussing your fitness goals. See you soon!",
    sortOrder: 3,
  },
  {
    name: "Post-Consultation",
    content:
      "Hi #{firstName}, thanks for taking the time to chat today! I'm excited to help you achieve your goals. I'll send through the program details shortly. Have a great day!",
    sortOrder: 4,
  },
] as const;
