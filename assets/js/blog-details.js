(() => {
    if (!document.body.classList.contains("blog-details-page")) return;
    const entries = {
        "breathing-rhythm": {
            title: "Finding your breathing rhythm",
            category: "Swimming tips",
            image: "blog-breathing",
            headings: [
                "Start with comfort, then coordination.",
                "Practice one element at a time.",
                "Build rhythm with your coach.",
            ],
            paragraphs: [
                [
                    "A relaxed breath starts with feeling comfortable in the water. Tell your instructor what feels easy and what feels uncertain before trying a new drill.",
                    "Your coach can break breathing into manageable steps and help you avoid rushing. Practice in an appropriately supervised lesson and follow the instructions for your level.",
                ],
                [
                    "Work on a gentle, steady exhalation before combining it with movement. Your instructor may use supported exercises so you can focus on one skill at a time. Avoid holding your breath or trying underwater endurance challenges.",
                ],
                [
                    "As coordination improves, connect your breathing with the stroke you are learning. Keep the pace comfortable and ask for feedback when the movement feels rushed.",
                    "Progress may mean feeling calmer, understanding a cue, or repeating an exercise more comfortably. Build on those small improvements with regular, supervised practice.",
                ],
            ],
        },
        "water-safety": {
            title: "A confident start to water safety",
            category: "Water safety",
            image: "blog-safety",
            headings: [
                "Start with clear poolside habits.",
                "Make supervision part of the routine.",
                "Keep learning the next safe step.",
            ],
            paragraphs: [
                [
                    "Before a lesson, review the facility’s entry rules, pool boundaries and instructions with your child and their coach. Familiar routines help a new swimmer understand what is expected.",
                    "Ask the instructor how learners enter and leave the water, where they wait, and how to request help. Follow the facility’s rules every visit.",
                ],
                [
                    "Swimming lessons do not replace attentive adult supervision. Discuss responsibilities with the facility and keep children under appropriate supervision around water. Use equipment only as directed by a qualified instructor.",
                ],
                [
                    "Let the coach choose exercises that match the learner’s readiness. Avoid pressure to move into deeper water or attempt unfamiliar skills independently.",
                    "Revisit the rules as confidence grows. Knowing when to stop, listen and ask for help is part of a thoughtful swimming routine.",
                ],
            ],
        },
        "healthy-routine": {
            title: "Swimming into a healthier routine",
            category: "Adult fitness",
            image: "blog-fitness",
            headings: [
                "Choose a routine you can sustain.",
                "Prepare for a comfortable session.",
                "Build consistency gradually.",
            ],
            paragraphs: [
                [
                    "Start by choosing lesson times that fit your existing week. A comfortable, repeatable routine is easier to maintain than an ambitious schedule that leaves you rushing.",
                    "Discuss your experience and goals with your coach so practice can start at an appropriate level. Let them know about any individual support needs.",
                ],
                [
                    "Prepare your swimwear, cap, goggles and towel in advance. Leave enough time to arrive, change and listen to the session briefing. Follow your instructor’s guidance on warm-up, pace and breaks.",
                ],
                [
                    "Focus on consistent attendance and manageable technique goals rather than comparing your distance or speed with other swimmers.",
                    "Review how the routine fits your week and talk to your coach about adjustments. Feeling more comfortable and returning regularly are useful milestones.",
                ],
            ],
        },
        "recognizing-progress": {
            title: "What progress can feel like",
            category: "Swimming tips",
            image: "article-related",
            headings: [
                "Notice the small improvements.",
                "Use feedback to guide practice.",
                "Choose your next achievable goal.",
            ],
            paragraphs: [
                [
                    "Progress can be quieter than a faster lap. Feeling calmer at the pool edge, understanding a coaching cue or repeating a skill with less hesitation are changes worth recognizing.",
                    "Compare your experience with your own starting point. Different swimmers develop confidence and coordination at different rates.",
                ],
                [
                    "Ask your coach which parts of a skill are improving and which deserve more practice. A clear observation can turn a vague goal into a manageable exercise.",
                ],
                [
                    "Agree on one suitable skill to focus on during your next sessions. Keep practice appropriate to your level and supervised by a qualified instructor.",
                    "Review the goal together and celebrate what you can now repeat comfortably. Use that feedback to decide on the next small step.",
                ],
            ],
        },
    };
    const key = new URLSearchParams(location.search).get("article");
    if (!key || !Object.hasOwn(entries, key)) return;
    const item = entries[key];
    const S = window.Orynwave;
    document.title = `${item.title} | Orynwave Swim Academy`;
    const hero = document.querySelector(".inner-hero");
    hero.querySelector("h1").textContent = item.title;
    hero.querySelector(".eyebrow").textContent = `Swim journal · ${item.category}`;
    hero.querySelector(".breadcrumb").innerHTML =
        '<a href="homepage1.html">Home</a><span>/</span><a href="blog.html">Swim journal</a>';
    const image = hero.querySelector("img");
    image.src = `../assets/images/${item.image}.webp`;
    image.srcset = `../assets/images/${item.image}-640.webp 640w, ../assets/images/${item.image}.webp 1200w`;
    image.alt = item.title;
    const article = document.querySelector("article.article");
    const ids = ["prepare", "pack", "pace"];
    article.innerHTML =
        `<span class="eyebrow">${S.escape(item.category)}</span>` +
        item.headings
            .map(
                (heading, index) =>
                    `<h2 id="${ids[index]}">${S.escape(heading)}</h2>` +
                    item.paragraphs[index].map((copy) => `<p>${S.escape(copy)}</p>`).join(""),
            )
            .join("") +
        '<p class="article-guidance">Follow the guidance of your qualified instructor and facility. Never practice in the water without appropriate supervision.</p>';
    document.querySelectorAll('aside a[href^="#"]').forEach((link, index) => {
        link.innerHTML = `${String(index + 1).padStart(2, "0")} · ${S.escape(item.headings[index])}<i data-lucide="arrow-right" aria-hidden="true"></i>`;
    });
    const topics = document.querySelector("aside > p");
    if (topics)
        topics.textContent = `Related topics: ${item.category.toLowerCase()} · coach-led learning · swimming progress`;
    const summary = item.paragraphs[0][0];
    document.querySelector('meta[name="description"]')?.setAttribute("content", summary);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", summary);
    document.querySelectorAll('a[href*="article=recognizing-progress"]').forEach((link) => {
        if (key === "recognizing-progress") {
            link.href = "blog-details.html?article=breathing-rhythm";
            const card = link.closest("article");
            card.querySelector("h3").textContent = "Finding your breathing rhythm";
            card.querySelector("p").textContent =
                "A calmer breath makes everything feel a little easier.";
            link.setAttribute("aria-label", "Read Finding your breathing rhythm");
            const img = card.querySelector("img");
            img.src = "../assets/images/blog-breathing.webp";
            img.srcset =
                "../assets/images/blog-breathing-640.webp 640w, ../assets/images/blog-breathing.webp 1200w";
            img.alt = "Finding your breathing rhythm";
        }
    });
    S.icons();
    document.body.dataset.article = key;
})();
