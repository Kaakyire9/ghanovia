"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ProFormValues = {
  fullName: string;
  trade: string;
  serviceArea: string;
  postcode: string;
  experience: string;
  rate: string;
  rateType: "hourly" | "fixed";
  bio: string;
  phone: string;
  whatsapp: string;
  showPhone: boolean;
  availability: string;
};

type Step = {
  id: string;
  title: string;
  description: string;
  fields: Array<keyof ProFormValues>;
};

const steps: Step[] = [
  {
    id: "basics",
    title: "Basics",
    description: "Tell us who you are and what you do.",
    fields: ["fullName", "trade", "serviceArea", "postcode"],
  },
  {
    id: "services",
    title: "Services",
    description: "Share your experience, availability, and rates.",
    fields: ["experience", "availability", "rate", "rateType", "bio"],
  },
  {
    id: "contact",
    title: "Contact",
    description: "How clients can reach you once verified.",
    fields: ["phone", "whatsapp"],
  },
];

const trades = [
  "Plumber",
  "Electrician",
  "Driver / Instructor",
  "Barber",
  "Makeup Artist",
  "Cleaner",
  "Handyman",
  "Catering",
];

export default function BecomeProPage() {
  const form = useForm<ProFormValues>({
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      trade: "",
      serviceArea: "",
      postcode: "",
      experience: "",
      rate: "",
      rateType: "hourly",
      bio: "",
      phone: "",
      whatsapp: "",
      showPhone: false,
      availability: "",
    },
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [submittedValues, setSubmittedValues] = useState<ProFormValues | null>(
    null,
  );

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  const handleNext = async () => {
    const valid = await form.trigger(currentStep.fields);
    if (!valid) return;
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = (values: ProFormValues) => {
    setSubmittedValues(values);
  };

  const summary = useMemo(() => {
    if (!submittedValues) return null;
    return [
      { label: "Full name", value: submittedValues.fullName },
      { label: "Trade", value: submittedValues.trade },
      {
        label: "Service area",
        value: `${submittedValues.serviceArea} (${submittedValues.postcode})`,
      },
      { label: "Experience", value: submittedValues.experience },
      { label: "Availability", value: submittedValues.availability },
      {
        label: "Rate",
        value: `${submittedValues.rate || "N/A"} ${
          submittedValues.rateType === "hourly" ? "per hour" : "fixed"
        }`,
      },
      { label: "Bio", value: submittedValues.bio },
      { label: "Phone", value: submittedValues.phone },
      { label: "WhatsApp", value: submittedValues.whatsapp },
    ];
  }, [submittedValues]);

  return (
    <div className="bg-muted/30">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-12">
        <header className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Ghanovia for pros
          </p>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            Become a verified pro and get matched with UK clients who value
            reliability.
          </h1>
          <p className="text-muted-foreground">
            Share your trade, service area, and how you prefer to be contacted.
            We&apos;ll verify your right to work before listing you.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle>Pro signup</CardTitle>
                <span className="text-sm text-muted-foreground">
                  Step {stepIndex + 1} of {steps.length}
                </span>
              </div>
              <CardDescription>{currentStep.description}</CardDescription>
              <div className="flex gap-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`h-1 flex-1 rounded-full ${
                      index <= stepIndex ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  {currentStep.id === "basics" && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="fullName"
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ama Boateng"
                                autoComplete="name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="trade"
                        rules={{ required: "Choose your trade" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trade</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select trade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {trades.map((trade) => (
                                  <SelectItem key={trade} value={trade}>
                                    {trade}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="serviceArea"
                        rules={{ required: "List your service area" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City / town</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="London, Manchester, Birmingham..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="postcode"
                        rules={{ required: "Postcode helps clients find you" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postcode</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. SE15" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {currentStep.id === "services" && (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="experience"
                          rules={{
                            required: "Add a short experience summary",
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Experience</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="5 years plumbing, Gas Safe registered"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="availability"
                          rules={{
                            required: "Let clients know when you work",
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Availability</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Weekdays 8-6, emergencies"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="rate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Starting rate</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="From £40"
                                  inputMode="numeric"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                You can adjust per job; we just need a starting
                                point.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="rateType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rate type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="hourly">Hourly</SelectItem>
                                  <SelectItem value="fixed">Fixed</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="bio"
                        rules={{ required: "Add a short intro" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Short bio</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="What makes you reliable? Any certifications or specialties?"
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {currentStep.id === "contact" && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        rules={{ required: "Phone number is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+447..."
                                inputMode="tel"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>WhatsApp (optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Same as phone or different"
                                inputMode="tel"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              We can route clients via WhatsApp if you prefer.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
                        We&apos;ll verify your right to work and publish your
                        profile with a verified badge. Clients will be able to
                        message you directly.
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={stepIndex === 0}
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                    {isLastStep ? (
                      <Button type="submit">Submit for verification</Button>
                    ) : (
                      <Button type="button" onClick={handleNext}>
                        Continue
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="self-start bg-card/60">
            <CardHeader>
              <CardTitle>What happens next</CardTitle>
              <CardDescription>
                Quick review so clients can trust you from day one.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  • Submit your details → we request ID/right-to-work proof.
                </li>
                <li>• We verify and issue your Ghanovia verified badge.</li>
                <li>• Clients search by trade/postcode and contact you.</li>
                <li>• You set your schedule and rates; we track inquiries.</li>
              </ul>
              {summary && (
                <div className="rounded-lg border bg-background/60 p-4 text-sm">
                  <p className="mb-2 font-medium">Your summary</p>
                  <dl className="space-y-2">
                    {summary.map((item) => (
                      <div key={item.label} className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">{item.label}</dt>
                        <dd className="font-medium text-right">
                          {item.value || "—"}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
