interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescriptive extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescriptive {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartDescriptive {
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartSpecial extends CoursePartDescriptive {
  requirements: string[];
  kind: "special";
}

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`,
  );
};

const Header = ({ name }: { name: string }) => <h1>{name}</h1>;

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return courseParts.map((p) => <CoursePart key={p.name} data={p} />);
};

const CoursePart = ({ data }: { data: CoursePart }) => {
  const style = { marginBottom: 0 };

  let content;

  switch (data.kind) {
    case "basic":
      content = <i>{data.description}</i>;
      break;

    case "group":
      content = <>project exercises {data.groupProjectCount}</>;
      break;

    case "background":
      content = (
        <>
          <div>
            <i>{data.description}</i>
          </div>
          <div>submit to {data.backgroundMaterial}</div>
        </>
      );
      break;

    case "special":
      content = (
        <>
          <div>
            <i>{data.description}</i>
          </div>
          <div>required skills: {data.requirements.join(", ")}</div>
        </>
      );
      break;

    default:
      return assertNever(data);
  }

  return (
    <div>
      <h4 style={style}>
        {data.name} {data.exerciseCount}
      </h4>
      <div>{content}</div>
    </div>
  );
};

const Total = ({ total }: { total: number }) => {
  return <p>Number of exercises {total}</p>;
};

const App = () => {
  const courseName = "Half Stack application development";

  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic",
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group",
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic",
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial:
        "https://type-level-typescript.com/template-literal-types",
      kind: "background",
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special",
    },
  ];

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total
        total={courseParts.reduce((accum, p) => p.exerciseCount + accum, 0)}
      />
    </div>
  );
};

export default App;
