const AssignedTrainingProgram = {
  _id: "id",
  name: "",
  weeksDuration: 9,
  assignedTo: "client's user id",
  assignedBy: "trainer's user id",
  days: [
    {
      name: "fullbody 1",
      dayIndex: 0,
      exercises: {
        lifts: [
          {
            muscleGroup: "Chest",
            name: "Bench Press",
            type: "lift",
            liftIndex: 0,
            sets: [
              {
                setIndex: 0,
                reps: "5 - 8",
                weight: {
                  min: 40,
                  max: 60,
                },
                rest: {
                  min: 150,
                  max: 180,
                },
                rir: {
                  min: 1,
                  max: 2,
                },
                performances: [
                  { weekIndex: 0, weight: 50, reps: 8, rir: 2 },
                  { weekIndex: 1, weight: 70, reps: 8, rir: 2 },
                ],
              },
              {
                setIndex: 1,
                minReps: 5,
                maxReps: 8,
                minWeight: 40,
                maxWeight: 60,
                minRest: 150,
                maxRest: 180,
                minRir: 0,
                maxRir: 1,
                performances: [
                  { weekIndex: 0, weight: 60, reps: 8, rir: 1 },
                  { weekIndex: 1, weight: 75, reps: 8, rir: 1 },
                ],
              },
            ],
          },
        ],
        cardio: [
          {
            cardioIndex: 0,
            name: "Treadmill",
            sets: [
              {
                setIndex: 0,
                speed: {
                  min: 4.5,
                  max: 6,
                },
                incline: {
                  min: 10,
                  max: 15,
                },
                minTime: 20,
                maxTime: 45,
                performances: [
                  {
                    weekIndex: 0,
                    speed: 5,
                    incline: 10,
                    time: 20,
                  },
                  {
                    weekIndex: 1,
                    speed: 5,
                    incline: 15,
                    time: 20,
                  },
                ],
              },
            ],
          },
        ],
        stretches: [
          {
            name: "worlds greatest stretch",
            weight: "bw", // string | null (if bodyweight)
            totalSeconds: "10 rep",
            holdSeconds: { min: 2, max: null },
            restSeconds: {
              min: 0,
              max: null,
            },
            performances: [
              {
                weekIndex: 0,
                weight: "",
                reps: 10,
                rir: null,
              },
              {
                weekIndex: 1,
                weight: "",
                reps: 10,
                rir: null,
              },
            ],
          },
        ],
      },
    },
  ],
};

const User = {
  name: "Billy",
  // (auth thingies)
  role: "trainer",
  assignedProgramIds: [],
};
