"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { FormEvent, FormEventHandler, ReactNode, useEffect, useState } from "react";
import useOutlets from "@/hooks/useOutlets";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const OnboardingUX = () => {
  const  [loading, setLoading] = useState(false)
  const [pollUserInterval, setPollUserInterval] = useState<NodeJS.Timeout | null>(null)
  const [step, setStep] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [resetAuthorPage, setResetAuthorPage] = useState(false);

  const supabase = createClient();

  const outletsQuery = useOutlets()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: userRecord }, error } = await supabase.auth.getUser();
      if(error) {
        console.error(error)
        return
      }

      setUser(userRecord);
    }
    
    setStep(1);

    getUser()

    const i = setInterval(getUser, 1000)
    setPollUserInterval(i)
    return () => clearInterval(i)
  }, []);

  const nextStep = () => {
    setStep(step + 1);
  }

  const prevStep = () => {
    setStep(step - 1);
  }

  const updateOutlet = async (ev: FormEvent) => {
    ev.preventDefault()

    setLoading(true)
    console.log(ev.target)
    const formData = new FormData(ev.target as HTMLFormElement)
    const outlet = formData.get("outlet") as string

    const { data: { user: userRecord }, error } = await supabase.auth.updateUser({
      data: { outletName: outlet },
    })

    if(error) {
      console.error(error)
      setLoading(false)
      return
    }

    setUser(userRecord)
    setLoading(false)
    nextStep()
  }

  if(!user || outletsQuery.isLoading) return null;
  if(outletsQuery.isError) return <div>Error</div>

  const onboardingChecklist = {
    signedInFromExtension: false,
    storedArticleFromAuthorPage: false,
    ...user.user_metadata.onboarding_checklist
  }

  const setupStep = onboardingChecklist.storedArticleFromAuthorPage ? 3
    : onboardingChecklist.signedInFromExtension ? 2
    : 1

  const outlets = outletsQuery.data
  const outletFomAuthorPage = user && user.user_metadata.author_pages && outlets && outlets.find(outlet => {
    const author_page = user.user_metadata.author_pages[0]
    const hosts = outlet.hosts || []

    return hosts.some(h => {
      return author_page.includes(h)
    })
  });

  const outlet = user.user_metadata.outletName ? {name: user.user_metadata.outletName } : outletFomAuthorPage

  const OnboardingStep = ({children, stepNumber, currentStep, title}: {
    children: ReactNode,
    stepNumber: number,
    currentStep: number,
    title: string
  }) => {
    const current = currentStep === stepNumber
    const completed = currentStep > stepNumber

    return <div className={`
      flex flex-col gap-4
      ${!current ? "opacity-20 pointer-events-none" : null}
      ${completed ? "line-through pointer-events-none" : null}
      `}>
        <h3 className="text-xl font-bold">{stepNumber}. {title}</h3>
      {children}
    </div>
  }

  return (
    <div className="flex-1 w-2/3 flex flex-col justify-center">
      <AnimatePresence mode="popLayout">
        {step === 1 && (
          <motion.div className="flex-1 w-full flex flex-col gap-6 items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <h1 className="text-6xl">Welcome {user?.user_metadata.first_name}</h1>
            <p>Let's create your story safe together</p>
            <Button onClick={nextStep}>Let's begin</Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div className="flex-1 w-full flex flex-col gap-6 items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
              {outlet && !resetAuthorPage ? (
                <>
                  <p>So you write for?</p>
                  <h1 className="text-6xl">{outlet?.name}</h1>
                  <p>Very impressive!</p>
                  <div className="flex flex-row gap-2">
                  <Button onClick={() => setStep(4)}>Yes, I do</Button>
                  <Button variant="ghost" onClick={() => setResetAuthorPage(true)}>That's not right</Button>
                  </div>
                </>
              ) : (
                <>
                  <p>Tell us?</p>
                  <h1 className="text-6xl">Who do you write for?</h1>
                  <form className="flex gap-2" onSubmit={updateOutlet}>
                    <Input name="outlet" placeholder="The New York Times" className="text-center" />
                    <Button type="submit">Continue</Button>
                  </form>
                </>
              )}
          </motion.div>
        )}

        {/* COLLECT ACTUAL OUTLET */}
        {step === 3 && (
          <motion.div className="flex-1 w-full flex flex-col gap-6 items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
              <>
                <p>Oh</p>
                <h1 className="text-6xl">{outlet?.name}</h1>
                <p>Very impressive!</p>
                <div className="flex flex-row gap-2">
                <Button onClick={nextStep}>Yes I do</Button>
                <Button variant="ghost" onClick={() => setResetAuthorPage(true)}>That's not right</Button>
                </div>
              </>
          </motion.div>
        )}


        {step === 4 && (
          <motion.div className="flex-1 w-full flex flex-col gap-6 items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
              <p>Excellent</p>
              <h1 className="text-6xl">Let's begin...</h1>
              <p>Follow the instructions below to start storing your {outlet && `${outlet.name} `}articles to you story safe.</p>
              <div className="flex flex-col gap-4">

                <OnboardingStep stepNumber={1} currentStep={setupStep} title={"Download the chrome extension"}>
                  <p>This extension sits in your browser. You can download it from the chrome extension store (for free!) and login with your story safe account.</p>

                  <div className="flex gap-2">
                    <Button className="max-w-[300px]" asChild>
                      <Link href="https://chromewebstore.google.com/detail/story-safe/pfobliofcgkfboipdbinhejfjhpkeocl" target="_blank">Download</Link>
                    </Button>
                    <Button variant="ghost" className="max-w-[300px]">
                      Skip this step
                    </Button>
                  </div>
                </OnboardingStep>

                <OnboardingStep stepNumber={2} currentStep={setupStep} title={"Run a backup"}>
                  <p>Using the extension, start backing up articles. The extension will show you how many have been stored. It's a good idea to capture the last year's articles at least. Keep scrolling your author page until you're happy.</p>
                </OnboardingStep>
  
                <OnboardingStep stepNumber={3} currentStep={setupStep} title={"Checkout your dashboard"}>
                  <p>Once you've backed up some articles come back here and...</p>

                  <Button className="max-w-[300px] mt-8" asChild>
                    <Link href="/articles">Check out your dashboard</Link>
                  </Button>
                </OnboardingStep>
              </div>
          </motion.div>
        )}

      </AnimatePresence>

      <Button onClick={() => supabase.auth.updateUser({data: {
        onboarding_checklist :{
          storedArticleFromAuthorPage: false,
          signedInFromExtension: false
        }
        }})}>
            reset
      </Button>

      <p>implement `storageKey` so that log out from extension does break the website (untested theory)</p>
    </div>
  );
}

export default OnboardingUX;