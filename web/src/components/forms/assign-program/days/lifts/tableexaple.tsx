import React, { useState } from "react";
import { Plus, X, ChevronUp, ChevronDown } from "lucide-react";

const ProgramBuilder = () => {
  const [activeSections, setActiveSections] = useState(["lifts"]);
  const [lifts, setLifts] = useState([
    {
      id: 1,
      name: "Bench Press",
      muscle: "Chest",
      sets: [
        { id: 11, weight: "135-155", reps: "8-12", rest: "60-90", rir: "1-3" },
        { id: 12, weight: "135-155", reps: "8-12", rest: "60-90", rir: "1-3" },
        { id: 13, weight: "135-155", reps: "8-12", rest: "60-90", rir: "1-3" },
      ],
    },
    {
      id: 2,
      name: "Pullup",
      muscle: "Back",
      sets: [
        { id: 21, weight: "min-max", reps: "3-8", rest: "60-90", rir: "1-3" },
        { id: 22, weight: "min-max", reps: "3-8", rest: "60-90", rir: "1-3" },
        { id: 23, weight: "min-max", reps: "3-8", rest: "60-90", rir: "1-3" },
      ],
    },
  ]);
  const [stretches, setStretches] = useState([
    {
      id: 1,
      name: "Pigeon Stretch",
      set: 1,
      weight: "min-max",
      total: "min-max",
      holds: "min-max",
      rest: "min-max",
    },
  ]);
  const [cardio, setCardio] = useState([
    {
      id: 1,
      name: "Treadmill Run",
      duration: "20-30",
      intensity: "Moderate",
      rest: "2-3",
      notes: "Steady pace",
    },
  ]);

  const sectionTypes = {
    lifts: {
      label: "Lifts",
      icon: "🏋️",
      color: "bg-blue-50 border-blue-200 text-blue-700",
    },
    stretches: {
      label: "Stretches",
      icon: "🧘",
      color: "bg-green-50 border-green-200 text-green-700",
    },
    cardio: {
      label: "Cardio",
      icon: "🏃",
      color: "bg-red-50 border-red-200 text-red-700",
    },
  };

  const addSection = (sectionType) => {
    if (!activeSections.includes(sectionType)) {
      setActiveSections([...activeSections, sectionType]);
    }
  };

  const removeSection = (sectionType) => {
    setActiveSections(
      activeSections.filter((section) => section !== sectionType)
    );
  };

  const addExercise = (sectionType) => {
    const newId = Date.now();
    if (sectionType === "lifts") {
      setLifts([
        ...lifts,
        {
          id: newId,
          name: "",
          muscle: "",
          sets: [
            { id: newId * 10 + 1, weight: "", reps: "", rest: "", rir: "" },
          ],
        },
      ]);
    } else if (sectionType === "stretches") {
      setStretches([
        ...stretches,
        {
          id: newId,
          name: "",
          set: 1,
          weight: "min-max",
          total: "min-max",
          holds: "min-max",
          rest: "min-max",
        },
      ]);
    } else if (sectionType === "cardio") {
      setCardio([
        ...cardio,
        {
          id: newId,
          name: "",
          duration: "",
          intensity: "",
          rest: "",
          notes: "",
        },
      ]);
    }
  };

  const addSet = (exerciseId) => {
    setLifts(
      lifts.map((lift) => {
        if (lift.id === exerciseId) {
          const newSetId = Date.now();
          return {
            ...lift,
            sets: [
              ...lift.sets,
              { id: newSetId, weight: "", reps: "", rest: "", rir: "" },
            ],
          };
        }
        return lift;
      })
    );
  };

  const removeSet = (exerciseId, setId) => {
    setLifts(
      lifts.map((lift) => {
        if (lift.id === exerciseId) {
          return {
            ...lift,
            sets: lift.sets.filter((set) => set.id !== setId),
          };
        }
        return lift;
      })
    );
  };

  const moveExercise = (sectionType, exerciseId, direction) => {
    if (sectionType === "lifts") {
      const currentIndex = lifts.findIndex((lift) => lift.id === exerciseId);
      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (newIndex >= 0 && newIndex < lifts.length) {
        const newLifts = [...lifts];
        [newLifts[currentIndex], newLifts[newIndex]] = [
          newLifts[newIndex],
          newLifts[currentIndex],
        ];
        setLifts(newLifts);
      }
    }
  };

  const removeExercise = (sectionType, id) => {
    if (sectionType === "lifts") {
      setLifts(lifts.filter((lift) => lift.id !== id));
    } else if (sectionType === "stretches") {
      setStretches(stretches.filter((stretch) => stretch.id !== id));
    } else if (sectionType === "cardio") {
      setCardio(cardio.filter((c) => c.id !== id));
    }
  };

  const availableSections = Object.keys(sectionTypes).filter(
    (section) => !activeSections.includes(section)
  );

  const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];

  const renderLiftsTable = () => (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏋️</span>
          <h3 className="text-lg font-semibold text-gray-900">Lifts</h3>
        </div>
        <button
          onClick={() => removeSection("lifts")}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 text-sm font-medium text-gray-600 w-16"></th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Name
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Muscle
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Set
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Weight
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Reps
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Rest (s)
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                RIR
              </th>
              <th className="w-16"></th>
            </tr>
          </thead>
          <tbody>
            {lifts.map((exercise, exerciseIndex) =>
              exercise.sets.map((set, setIndex) => (
                <tr
                  key={`${exercise.id}-${set.id}`}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  {/* Exercise Controls - only on first row */}
                  <td className="p-4">
                    {setIndex === 0 && (
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() =>
                            moveExercise("lifts", exercise.id, "up")
                          }
                          disabled={exerciseIndex === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          onClick={() =>
                            moveExercise("lifts", exercise.id, "down")
                          }
                          disabled={exerciseIndex === lifts.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Exercise Name - only on first row */}
                  <td className="p-4">
                    {setIndex === 0 ? (
                      <input
                        type="text"
                        value={exercise.name}
                        className="w-full border border-gray-200 rounded px-2 py-1 font-medium"
                        placeholder="Exercise name"
                      />
                    ) : (
                      <div className="text-gray-300">•</div>
                    )}
                  </td>

                  {/* Muscle Group - only on first row */}
                  <td className="p-4">
                    {setIndex === 0 ? (
                      <input
                        type="text"
                        value={exercise.muscle}
                        className="w-full border border-gray-200 rounded px-2 py-1"
                        placeholder="Muscle group"
                      />
                    ) : (
                      <div className="text-gray-300">•</div>
                    )}
                  </td>

                  {/* Set Number */}
                  <td className="p-4">
                    <span className="text-gray-600 font-medium">
                      {setIndex + 1}
                    </span>
                  </td>

                  {/* Set Details */}
                  <td className="p-4">
                    <input
                      type="text"
                      value={set.weight}
                      className="w-full border border-gray-200 rounded px-2 py-1"
                      placeholder="135-155"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={set.reps}
                      className="w-full border border-gray-200 rounded px-2 py-1"
                      placeholder="8-12"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={set.rest}
                      className="w-full border border-gray-200 rounded px-2 py-1"
                      placeholder="60-90"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={set.rir}
                      className="w-full border border-gray-200 rounded px-2 py-1"
                      placeholder="1-3"
                    />
                  </td>

                  {/* Set Controls */}
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {setIndex === exercise.sets.length - 1 && (
                        <button
                          onClick={() => addSet(exercise.id)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Add set"
                        >
                          <Plus size={14} />
                        </button>
                      )}
                      {exercise.sets.length > 1 && (
                        <button
                          onClick={() => removeSet(exercise.id, set.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove set"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => addExercise("lifts")}
          className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          Lift
        </button>
      </div>
    </div>
  );

  const renderStretchesTable = () => (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧘</span>
          <h3 className="text-lg font-semibold text-gray-900">Stretches</h3>
        </div>
        <button
          onClick={() => removeSection("stretches")}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Name
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Set
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Weight
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Total (s)
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Holds (s)
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Rest (s)
              </th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {stretches.map((stretch) => (
              <tr key={stretch.id} className="border-b border-gray-100">
                <td className="p-4">
                  <input
                    type="text"
                    value={stretch.name}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                    placeholder="Stretch name"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="number"
                    value={stretch.set}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={stretch.weight}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                    placeholder="min-max"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={stretch.total}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                    placeholder="min-max"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={stretch.holds}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                    placeholder="min-max"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={stretch.rest}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                    placeholder="min-max"
                  />
                </td>
                <td className="p-4">
                  <button
                    onClick={() => removeExercise("stretches", stretch.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => addExercise("stretches")}
          className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          Stretch
        </button>
      </div>
    </div>
  );

  const renderCardioTable = () => (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏃</span>
          <h3 className="text-lg font-semibold text-gray-900">Cardio</h3>
        </div>
        <button
          onClick={() => removeSection("cardio")}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Name
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Duration (min)
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Intensity
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Rest (min)
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Notes
              </th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {cardio.map((exercise) => (
              <tr key={exercise.id} className="border-b border-gray-100">
                <td className="p-4">
                  <input
                    type="text"
                    value={exercise.name}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                    placeholder="Exercise name"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={exercise.duration}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                    placeholder="20-30"
                  />
                </td>
                <td className="p-4">
                  <select
                    value={exercise.intensity}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="">Select intensity</option>
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="HIIT">HIIT</option>
                  </select>
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={exercise.rest}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                    placeholder="2-3"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={exercise.notes}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                    placeholder="Additional notes"
                  />
                </td>
                <td className="p-4">
                  <button
                    onClick={() => removeExercise("cardio", exercise.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => addExercise("cardio")}
          className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          Cardio
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Program Builder
            </h1>
            <p className="text-gray-600 mt-1">
              Create and manage workout programs
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <span>📋</span>
              Save Draft
            </button>
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Publish
            </button>
          </div>
        </div>

        {/* Program Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                defaultValue="12 Week Strength"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Name your program for future reference."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weeks Duration
              </label>
              <input
                type="number"
                defaultValue="12"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="The intended duration of the program."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client ID
              </label>
              <input
                type="text"
                defaultValue="Kevin Nguyen"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Who to assign this program to."
              />
            </div>
          </div>
        </div>

        {/* Day Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {days.map((day, index) => (
              <button
                key={day}
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  index === 0
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Section Management Controls */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Workout Sections
            </h2>

            {/* Add Section Dropdown */}
            {availableSections.length > 0 && (
              <div className="relative">
                <details className="group">
                  <summary className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <Plus size={16} />
                    Add Section
                    <ChevronDown
                      size={16}
                      className="group-open:rotate-180 transition-transform"
                    />
                  </summary>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {availableSections.map((sectionType) => (
                      <button
                        key={sectionType}
                        onClick={() => addSection(sectionType)}
                        className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <span className="text-lg">
                          {sectionTypes[sectionType].icon}
                        </span>
                        <span className="font-medium">
                          {sectionTypes[sectionType].label}
                        </span>
                      </button>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>

          {/* Active Sections Overview */}
          <div className="flex flex-wrap gap-2 mb-4">
            {activeSections.map((sectionType) => (
              <div
                key={sectionType}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${sectionTypes[sectionType].color}`}
              >
                <span>{sectionTypes[sectionType].icon}</span>
                {sectionTypes[sectionType].label}
                <button
                  onClick={() => removeSection(sectionType)}
                  className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Exercise Sections */}
        <div className="space-y-6">
          {activeSections.includes("lifts") && renderLiftsTable()}
          {activeSections.includes("stretches") && renderStretchesTable()}
          {activeSections.includes("cardio") && renderCardioTable()}

          {activeSections.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No sections added yet
              </h3>
              <p className="text-gray-600 mb-4">
                Add workout sections to start building your program
              </p>
              <div className="flex justify-center gap-3">
                {Object.entries(sectionTypes).map(([key, section]) => (
                  <button
                    key={key}
                    onClick={() => addSection(key)}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <span>{section.icon}</span>
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramBuilder;
