/* Resolve each catalog link to its own program and enrollment context. */
(() => {
    const programs = {
        "kids-swimming": {
            name: "Kids Swimming",
            age: "Ages 4–10",
            level: "beginner",
            fee: 89,
            image: "details-hero",
            headline: "Small splashes. Big possibilities.",
            description: "Build a happy, confident relationship with the water.",
            guardian: true,
        },
        "teen-swimming": {
            name: "Teen Swimming",
            age: "Ages 11–17",
            level: "intermediate",
            fee: 99,
            image: "program-teens",
            headline: "Find your rhythm. Build your confidence.",
            description: "Build technique, stamina and independence through purposeful practice.",
            guardian: true,
        },
        "adult-swimming": {
            name: "Adult Swimming",
            age: "Ages 18+",
            level: "beginner",
            fee: 89,
            image: "program-adults",
            headline: "Your pace. Your next chapter.",
            description: "A calm, encouraging place to start swimming or return to the water.",
        },
        "beginner-foundations": {
            name: "Beginner Foundations",
            age: "All ages",
            level: "beginner",
            fee: 89,
            image: "program-beginner",
            headline: "A confident start in the water.",
            description: "Develop water comfort, relaxed breathing and supported movement.",
        },
        "intermediate-skills": {
            name: "Intermediate Skills",
            age: "Assessment required",
            level: "intermediate",
            fee: 119,
            image: "program-intermediate",
            headline: "Refine every stroke. Find your flow.",
            description: "Improve stroke coordination, breathing rhythm and swimming stamina.",
        },
        "advanced-performance": {
            name: "Advanced Performance",
            age: "Ages 13+",
            level: "advanced",
            fee: 159,
            image: "program-advanced",
            headline: "Stronger technique. Purposeful performance.",
            description: "Develop efficient strokes through structured drills and coach feedback.",
            guardian: true,
        },
        "private-coaching": {
            name: "Private Coaching",
            age: "All ages",
            level: "private",
            fee: 199,
            image: "program-private",
            headline: "Your goals. Your own coaching.",
            description:
                "Work with your own coach on a pathway tailored to your experience and goals.",
        },
    };
    const pathways = {
        beginner: {
            label: "Beginner",
            heading: "Confidence, one new skill at a time.",
            skills: [
                [
                    "waves",
                    "Feel comfortable",
                    "Safe entry, pool awareness and simple water exploration.",
                ],
                [
                    "wind",
                    "Learn to breathe",
                    "Exhale in the water and coordinate a relaxed breath.",
                ],
                ["move", "Float & move", "Build balance, kicking and supported movement."],
            ],
            stages: [
                [
                    "Welcome to the water",
                    "Meet your coach, explore safe entry, practice bubbles and build confidence with support.",
                ],
                [
                    "Find your balance",
                    "Practice front and back floating, recovery to standing and controlled kicking.",
                ],
                [
                    "Put movement together",
                    "Connect kicking with simple arm movements and gentle breathing drills.",
                ],
                [
                    "Celebrate your progress",
                    "Review your skills and discuss the next appropriate pathway with your coach.",
                ],
            ],
            question: "Do I need previous swimming experience?",
            answer: "No prior lessons are needed for a beginner pathway. Tell your coach how comfortable you feel in the water so your starting point can be assessed.",
        },
        intermediate: {
            label: "Intermediate",
            heading: "More control. A steadier rhythm.",
            skills: [
                [
                    "waves",
                    "Refine your strokes",
                    "Improve body position and coordinate your arm and leg movements.",
                ],
                [
                    "wind",
                    "Find your rhythm",
                    "Practice relaxed breathing that supports consistent technique.",
                ],
                [
                    "activity",
                    "Build your stamina",
                    "Develop controlled swimming over progressively longer distances.",
                ],
            ],
            stages: [
                [
                    "Review your foundations",
                    "Your coach reviews your current strokes, water confidence and swimming goals.",
                ],
                [
                    "Refine your technique",
                    "Work through focused drills for body position, stroke timing and coordination.",
                ],
                [
                    "Build a steady rhythm",
                    "Connect breathing and technique while gradually increasing your practice distance.",
                ],
                [
                    "Review your next step",
                    "Assess your progress with your coach and identify the skills to develop next.",
                ],
            ],
            question: "Is an assessment required?",
            answer: "A coach-led assessment helps confirm that you can float comfortably and swim short distances before moving into this pathway.",
        },
        advanced: {
            label: "Advanced",
            heading: "Purposeful practice. Stronger performance.",
            skills: [
                [
                    "target",
                    "Improve efficiency",
                    "Refine body alignment and reduce unnecessary movement in your strokes.",
                ],
                [
                    "timer",
                    "Develop consistency",
                    "Practice controlled pacing and repeatable technique across multiple lengths.",
                ],
                [
                    "chart-no-axes-combined",
                    "Track your progress",
                    "Use structured practice and regular coach feedback to guide development.",
                ],
            ],
            stages: [
                [
                    "Assess your technique",
                    "Review your strokes, current consistency and training goals with your coach.",
                ],
                [
                    "Refine key skills",
                    "Focus on the technique details that will make your swimming more efficient.",
                ],
                [
                    "Apply structured practice",
                    "Develop pacing and consistency through purposeful drills and coach-led sessions.",
                ],
                [
                    "Review performance",
                    "Reflect on progress and agree on the next training priorities.",
                ],
            ],
            question: "What experience should I have?",
            answer: "This pathway is for swimmers with consistent strokes over multiple lengths. A coach assessment confirms readiness and suitable training goals.",
        },
        private: {
            label: "All levels",
            heading: "Focused attention for your personal goals.",
            skills: [
                [
                    "user-round",
                    "Start where you are",
                    "Your coach reviews your comfort, current experience and individual goals.",
                ],
                [
                    "target",
                    "Focus your practice",
                    "Work on the skills that matter most to your swimming journey.",
                ],
                [
                    "clipboard-check",
                    "Review together",
                    "Receive direct feedback and agree on clear, achievable next steps.",
                ],
            ],
            stages: [
                [
                    "Discuss your goals",
                    "Share your experience, confidence and what you would like to achieve.",
                ],
                [
                    "Build your pathway",
                    "Your coach agrees on a suitable starting point and priorities for practice.",
                ],
                [
                    "Practice with feedback",
                    "Develop your chosen skills through one-to-one guidance and appropriate drills.",
                ],
                [
                    "Review and adapt",
                    "Reflect on progress together and adapt the next sessions to your needs.",
                ],
            ],
            question: "Can coaching match my own goals?",
            answer: "Private coaching starts with a discussion and assessment so your coach can plan appropriate practice around your experience and goals.",
        },
    };
    const key = new URLSearchParams(location.search).get("program") || "kids-swimming";
    const slug = Object.hasOwn(programs, key) ? key : "kids-swimming";
    const program = programs[slug];
    const pathway = pathways[program.level];
    const escape = window.Orynwave.escape;
    const sections = [...document.querySelectorAll("main > section")];
    if (!document.body.classList.contains("program-details-page") || sections.length !== 6) return;
    document.title = `${program.name} | Orynwave Swim Academy`;
    const description = `${program.age} · ${pathway.label} · ${program.level === "private" ? "Private coaching" : "Group lessons"}. ${program.description}`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    const structuredData = document.querySelector('script[type="application/ld+json"]');
    if (structuredData) {
        const metadata = JSON.parse(structuredData.textContent);
        metadata.name = program.name;
        metadata.description = description;
        structuredData.textContent = JSON.stringify(metadata);
    }
    const hero = sections[0];
    hero.querySelector("h1").textContent = program.headline;
    hero.querySelector(".eyebrow").textContent = program.name;
    hero.querySelector(".lead").textContent = description;
    hero.querySelector(".breadcrumb").innerHTML =
        `<a href="homepage1.html">Home</a><span>/</span><a href="programs.html">Programs</a><span>/ ${escape(program.name)}</span>`;
    const image = hero.querySelector("img");
    image.src = `../assets/images/${program.image}.webp`;
    image.srcset = `../assets/images/${program.image}-640.webp 640w, ../assets/images/${program.image}.webp 1200w`;
    image.alt = `${program.name} swimming lesson`;
    sections[1].querySelector("h2").textContent = pathway.heading;
    sections[1].querySelector(".eyebrow").textContent = "What you will learn";
    sections[1].querySelectorAll(".feature").forEach((card, index) => {
        card.classList.remove(
            "skill-photo",
            "skill--comfort",
            "skill--breathing",
            "skill--floating",
        );
        if (slug === "kids-swimming")
            card.classList.add(
                "skill-photo",
                `skill--${["comfort", "breathing", "floating"][index]}`,
            );
        const [icon, title, copy] = pathway.skills[index];
        card.querySelector(".icon-box").innerHTML =
            `<i data-lucide="${icon}" aria-hidden="true"></i>`;
        card.querySelector("h3").textContent = title;
        card.querySelector("p").textContent = copy;
    });
    sections[2].querySelector(".eyebrow").textContent = "Your learning journey";
    sections[2].querySelector("h2").textContent = "A clear, encouraging pathway.";
    sections[2].querySelectorAll(".faq").forEach((item, index) => {
        item.querySelector("summary").textContent =
            `${String(index + 1).padStart(2, "0")} · ${pathway.stages[index][0]}`;
        item.querySelector("p").textContent = pathway.stages[index][1];
    });
    sections[3].querySelector(".eyebrow").textContent = "Sample session structure";
    const focus = [
        "Welcome, readiness and gentle movement",
        pathway.skills.map((skill) => skill[1].toLowerCase()).join(", "),
        "Focused practice to reinforce your lesson",
        "Review progress and share coach feedback",
    ];
    sections[3]
        .querySelectorAll("tbody tr")
        .forEach((row, index) => (row.cells[1].textContent = focus[index]));
    sections[3].querySelectorAll("tbody tr")[2].cells[0].textContent =
        slug === "kids-swimming" ? "Apply & play" : "Apply & practice";
    const fees = sections[4];
    fees.querySelector(".price-card h3").textContent = program.name;
    fees.querySelector(".price-card .eyebrow").textContent =
        `${pathway.label} · ${program.level === "private" ? "Private coaching" : "Group lessons"}`;
    fees.querySelector(".price").innerHTML =
        `$${program.fee}<small> / month · sample price</small>`;
    const inclusions = [
        "Coach-led sessions matched to your level",
        program.level === "private"
            ? "Individual guidance from your own coach"
            : "Structured group practice and feedback",
        "Regular skill reviews and progress notes",
        "Training equipment during lessons",
    ];
    fees.querySelectorAll(".price-card .check-list li").forEach(
        (item, index) =>
            (item.innerHTML = `<i data-lucide="check" aria-hidden="true"></i>${escape(inclusions[index])}`),
    );
    fees.querySelector(".form-panel h3").textContent = "Before your first session";
    fees.querySelector(".form-panel > p").textContent =
        `Choose an appropriate batch and tell us about your experience and goals. ${program.guardian ? "A parent or guardian should review the academy’s requirements for learners under 18." : "Review the academy’s current requirements before enrollment."}`;
    const firstFAQ = sections[5].querySelector(".faq");
    firstFAQ.querySelector("summary").textContent = pathway.question;
    firstFAQ.querySelector("p").textContent = pathway.answer;
    document
        .querySelectorAll('main a[href*="dashboard/member/index.html"]')
        .forEach((link) => {
            link.search = `?program=${slug}`;
            link.hash = "batch-enrollment";
        });
    window.Orynwave.icons();
    document.body.dataset.program = slug;
})();
