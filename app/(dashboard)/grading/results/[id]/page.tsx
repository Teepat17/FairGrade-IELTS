"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Download, FileText, Printer, Share2 } from "lucide-react"
import { GradingSummary } from "@/components/grading/grading-summary"
import { StudentDetails } from "@/components/grading/student-details"

// Mock data for demonstration
const mockGradingData = {
  id: "session-1234567890",
  name: "Physics Midterm - Spring 2023",
  subject: "Physics",
  createdAt: "2023-04-15T10:30:00Z",
  status: "completed",
  rubric: {
    name: "Basic Physics Rubric",
    content:
      "1. Correct answer with units (40%)\n2. Proper application of formulas (25%)\n3. Physical reasoning and explanations (25%)\n4. Diagrams and visual representations (10%)",
  },
  students: [
    {
      id: "student-1",
      name: "Student 1",
      filename: "student1_answers.jpg",
      score: 85,
      feedback: [
        {
          question: "Question 1: Calculate the force required to accelerate a 2kg object at 5m/s².",
          answer: "F = ma = 2kg × 5m/s² = 10N",
          score: 10,
          maxScore: 10,
          feedback: `SCORE: 10

STRENGTHS:
  • Correct application of Newton's Second Law
  • Proper use of units throughout

WEAKNESSES:
  • None identified

ANALYSIS:
  All steps shown clearly with proper mathematical notation and units.

SUGGESTIONS:
  • Consider adding a brief explanation of the physics principles
  • Could include a simple force diagram for visualization`
        },
        {
          question: "Question 2: Explain the difference between elastic and inelastic collisions.",
          answer:
            "In elastic collisions, both momentum and kinetic energy are conserved. In inelastic collisions, only momentum is conserved while some kinetic energy is converted to other forms.",
          score: 8,
          maxScore: 10,
          feedback: `SCORE: 8

STRENGTHS:
  • Clear understanding of conservation principles
  • Good comparison between collision types

WEAKNESSES:
  • No practical examples provided
  • Limited discussion of energy conversion

ANALYSIS:
  Good explanation of the key differences with focus on conservation laws.

SUGGESTIONS:
  • Include specific real-world examples
  • Add brief explanation of energy transformation`
        },
        {
          question:
            "Question 3: Calculate the work done when a force of 15N moves an object 3m in the direction of the force.",
          answer: "W = F × d = 15N × 3m = 45J",
          score: 10,
          maxScore: 10,
          feedback: `SCORE: 10

STRENGTHS:
  • Correct formula application
  • Proper units included

WEAKNESSES:
  • Could show intermediate steps

ANALYSIS:
  Clear and concise calculation with correct result and units.

SUGGESTIONS:
  • Show step-by-step calculation
  • Add brief explanation of work concept`
        },
      ],
    },
    {
      id: "student-2",
      name: "Student 2",
      filename: "student2_answers.jpg",
      score: 72,
      feedback: [
        {
          question: "Question 1: Calculate the force required to accelerate a 2kg object at 5m/s².",
          answer: "F = 2 × 5 = 10",
          score: 7,
          maxScore: 10,
          feedback: `SCORE: 7

STRENGTHS:
  • Basic calculation is correct
  • Shows multiplication operation

WEAKNESSES:
  • Missing units completely
  • Formula not explicitly shown

ANALYSIS:
  The calculation reaches the correct numerical result but lacks proper physics notation and units.

SUGGESTIONS:
  • Write out F = ma formula first
  • Include units in calculation`
        },
        {
          question: "Question 2: Explain the difference between elastic and inelastic collisions.",
          answer: "Elastic collisions bounce back, inelastic collisions don't.",
          score: 5,
          maxScore: 10,
          feedback: `SCORE: 5

STRENGTHS:
  • Basic concept understood
  • Simple explanation provided

WEAKNESSES:
  • Lacks scientific terminology
  • No mention of conservation laws

ANALYSIS:
  Very basic understanding demonstrated but missing key physics concepts.

SUGGESTIONS:
  • Include conservation laws in explanation
  • Use proper physics terminology`
        },
        {
          question:
            "Question 3: Calculate the work done when a force of 15N moves an object 3m in the direction of the force.",
          answer: "W = 15 × 3 = 45J",
          score: 9,
          maxScore: 10,
          feedback: `SCORE: 9

STRENGTHS:
  • Correct calculation
  • Proper units in answer

WEAKNESSES:
  • Formula not shown explicitly

ANALYSIS:
  Good solution with correct units but could show more work.

SUGGESTIONS:
  • Write out W = F × d formula
  • Show units in calculation steps`
        },
      ],
    },
    {
      id: "student-3",
      name: "Student 3",
      filename: "student3_answers.jpg",
      score: 93,
      feedback: [
        {
          question: "Question 1: Calculate the force required to accelerate a 2kg object at 5m/s².",
          answer: "Using Newton's Second Law: F = ma\nF = 2kg × 5m/s²\nF = 10N",
          score: 10,
          maxScore: 10,
          feedback: `SCORE: 10

STRENGTHS:
  • Perfect formula application
  • Clear step-by-step solution
  • All units included

WEAKNESSES:
  • None identified

ANALYSIS:
  Excellent solution showing complete understanding of Newton's Second Law.

SUGGESTIONS:
  • Could add brief explanation of why this law applies
  • Consider adding a force diagram`
        },
        {
          question: "Question 2: Explain the difference between elastic and inelastic collisions.",
          answer:
            "Elastic collisions conserve both momentum and kinetic energy. Examples include collisions between ideal billiard balls. Inelastic collisions conserve momentum but not kinetic energy, as some energy is converted to heat, sound, or deformation. Examples include cars crashing.",
          score: 10,
          maxScore: 10,
          feedback: `SCORE: 10

STRENGTHS:
  • Complete explanation of conservation laws
  • Excellent real-world examples
  • Clear comparison of both types

WEAKNESSES:
  • None identified

ANALYSIS:
  Perfect answer demonstrating deep understanding of collision types and energy conservation.

SUGGESTIONS:
  • Could add mathematical equations
  • Consider discussing partially elastic collisions`
        },
        {
          question:
            "Question 3: Calculate the work done when a force of 15N moves an object 3m in the direction of the force.",
          answer: "Work is calculated using W = F × d\nW = 15N × 3m\nW = 45J",
          score: 10,
          maxScore: 10,
          feedback: `SCORE: 10

STRENGTHS:
  • Clear formula statement
  • Step-by-step solution
  • Proper units throughout

WEAKNESSES:
  • None identified

ANALYSIS:
  Perfect solution with clear steps and proper physics notation.

SUGGESTIONS:
  • Could add energy conservation context
  • Consider adding real-world example`
        },
      ],
    },
  ],
}

export default function GradingResultsPage() {
  const params = useParams()
  const sessionId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [gradingData, setGradingData] = useState<any>(null)
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  // Simulate loading and fetching data
  useEffect(() => {
    const timer = setTimeout(() => {
      setGradingData(mockGradingData)
      setSelectedStudent(mockGradingData.students[0].id)
      setIsLoading(false)
    }, 1500)

    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 150)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Processing Results</h1>
          <p className="text-muted-foreground">Please wait while we process the grading results</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Grading in Progress</CardTitle>
            <CardDescription>The AI is analyzing student answers and applying the rubric</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">{progress}% complete</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!gradingData) {
    return (
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Results Not Found</h1>
          <p className="text-muted-foreground">
            The grading session you're looking for doesn't exist or has been removed
          </p>
        </header>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{gradingData.name}</h1>
            <p className="text-muted-foreground">
              {gradingData.subject} • {new Date(gradingData.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <Tabs defaultValue="summary">
        <TabsList className="mb-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="details">Student Details</TabsTrigger>
          <TabsTrigger value="rubric">Rubric</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <GradingSummary data={gradingData} onSelectStudent={setSelectedStudent} />
        </TabsContent>

        <TabsContent value="details">
          <StudentDetails data={gradingData} selectedStudent={selectedStudent} onSelectStudent={setSelectedStudent} />
        </TabsContent>

        <TabsContent value="rubric">
          <Card>
            <CardHeader>
              <CardTitle>Grading Rubric</CardTitle>
              <CardDescription>The criteria used to evaluate student answers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-muted p-4">
                <h3 className="mb-2 font-medium">{gradingData.rubric.name}</h3>
                <pre className="whitespace-pre-wrap text-sm">{gradingData.rubric.content}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
