const knowledgeTopics = [
  {
    title: "Basic pre-dive & buddy check", category: "Safety · Every dive", check: 1,
    intro: "A buddy check is a shared inspection and conversation, not a ritual performed from memory while everyone rushes toward the water. Its purpose is to find problems on the surface, establish how the team works, and make sure both divers understand the equipment and the plan.",
    sections: [
      ["Start with the person and the plan", "Discuss recent experience, comfort, health concerns, and anything unfamiliar about today's dive. Agree on the route, expected conditions, entry and exit, communication, and reasons to turn or finish. Clarify the gas plan and separation procedure using your training and the local briefing. Neither a guide nor an experienced buddy removes your responsibility to speak up. Anyone can decline a dive; an unexplained feeling of discomfort deserves attention rather than pressure to continue."],
      ["Use the check you were taught", "PADI and SSI training use organized pre-dive checks, but this independent review does not replace an agency's current sequence or equipment-specific instruction. Review buoyancy equipment, weighting and releases, closures and straps, breathing systems, and the final overall readiness of the team as taught. Check actual operation, not merely appearance. A gauge reading or a cylinder label alone cannot establish that a breathing system is working correctly. Follow the procedures taught for your configuration."],
      ["Understand your buddy's configuration", "Identify the alternate breathing source, weight-release arrangement, buoyancy controls, and surface-signaling equipment. Configurations vary: unfamiliar integrated weights, inflators, dry suits, or long-hose arrangements should be explained before use. Secure accessories so that they remain accessible without dangling into habitat. If a control or release cannot be located or understood, obtain help from a qualified professional before entering. Never assume that equipment supplied by a reputable operator needs no checks."],
      ["Make time to resolve findings", "A leaking component, damaged strap, unusual breathing resistance, or unresolved fit problem is a reason to pause and seek assistance. Do not reinterpret an equipment fault as acceptable because the dive is shallow or the group is waiting. Repeat relevant checks after equipment adjustments or a long delay. A briefing should also establish who is counting divers onto and off the boat, how assistance is summoned, and what surface conditions to expect at the exit."]
    ],
    prompt: "Before entry, can each buddy explain the plan, identify the other's essential controls, and name any concern that still needs resolving?",
    sources: ["reactivate", "ssi"]
  },
  {
    title: "Buoyancy, trim & weighting", category: "Core skills", check: 3,
    intro: "Buoyancy determines whether you rise, sink, or remain at a depth; trim describes your orientation in the water. Together with appropriate weighting and controlled propulsion, they affect comfort, gas use, ascent control, and how much impact you have on the environment.",
    sections: [
      ["Understand what changes during a dive", "Exposure protection can compress with depth, gas spaces respond to pressure, and a cylinder's buoyancy changes as breathing gas is used. This means a comfortable position at the start does not guarantee effortless control throughout the dive. Breathing influences fine buoyancy, but breath-holding is not a buoyancy technique. Breathe normally and continuously while using the buoyancy methods taught in your course. Unexplained control difficulties deserve a supervised review, not simply more lead."],
      ["Weighting is individual", "Body characteristics, water salinity, cylinder type, exposure protection, and carried equipment all influence weighting. Copying another diver's lead is unreliable. Excess weight can require more compensating gas and make control harder; insufficient weight can also cause difficulty maintaining control as conditions change. Review weighting with an instructor when your configuration changes. Use the check and conditions appropriate to your training, including consideration of the end of the dive, rather than a generic number from a website."],
      ["Trim and equipment organization", "A balanced configuration can reduce the effort needed to maintain a comfortable orientation. Cylinder position, accessory placement, and weight distribution influence balance, but changes should preserve access to releases and emergency equipment. Keep hoses, gauges, and camera accessories controlled. Select propulsion techniques appropriate to your skills and surroundings, and maintain clearance from sediment and living habitat. A horizontal position is useful in many settings, but it is not a reason to compromise breathing, comfort, or team awareness."],
      ["Practise before adding tasks", "Photography, navigation, current, and unfamiliar equipment all add demands. If maintaining depth requires constant attention, reduce those demands and arrange practice in a suitable controlled environment. A professional can observe issues that are difficult to diagnose yourself, such as finning to compensate for sinking or carrying unnecessary gas in the BCD. Follow your training and computer guidance for ascents and stops. This page cannot assess weighting or teach recovery from an uncontrolled ascent."]
    ],
    prompt: "What has changed since your last weighting review, and can you hold a comfortable position without touching the bottom or constantly swimming?",
    sources: ["reactivate", "dry", "ssi"]
  },
  {
    title: "Enriched air nitrox", category: "Specialty · Gas planning", check: 4,
    intro: "Enriched air nitrox has a higher oxygen fraction and a lower nitrogen fraction than air. Within an appropriate plan, this can reduce nitrogen exposure compared with air at the same depth and time. It also introduces oxygen-exposure considerations that require specific training.",
    sections: [
      ["Benefits do not remove other limits", "Nitrox may provide additional no-stop time in some circumstances, but it does not guarantee a longer dive. Gas supply, oxygen exposure, temperature, conditions, buddy needs, and the planned exit may end the dive earlier. It is not a gas for automatically going deeper: increasing oxygen fraction can reduce the maximum operating depth for a selected oxygen partial-pressure limit. Staying within no-stop limits does not make decompression illness impossible, and nitrox is not a treatment for unsafe planning."],
      ["Know the actual cylinder contents", "Cylinder color, a sticker, or a staff member's verbal description is not a substitute for the analysis and verification procedures taught in enriched-air training. Understand the analyzer, its preparation and limitations, and the operator's cylinder-identification system. Record and identify the gas according to the applicable procedure. If you cannot establish the contents or required analysis is unavailable, resolve the issue before use. Never guess the mix from what a buddy has been supplied."],
      ["Connect the gas to your equipment", "Your own computer must be configured for the verified gas and planning limits according to its instructions and your training. A correct analysis does not protect a diver using an incorrect setting. Equipment oxygen-compatibility and handling requirements depend on the equipment, mixture, filling method, and applicable standards; ordinary equipment is not automatically appropriate to every oxygen-enriched application. Ask the operator and manufacturer rather than assuming that all nitrox cylinders or regulators are interchangeable."],
      ["Manage oxygen exposure deliberately", "Oxygen toxicity risk depends on partial pressure and exposure duration, among other factors. A diver may not receive a reliable warning before a serious event. Maximum operating depth and exposure calculations belong in formal training; this article deliberately supplies no universal mix-depth table or shortcut. Repetitive dives require attention to cumulative exposure and the computer's information. Never change gas settings merely to clear a warning or extend a limit. Ask for clarification whenever the planned profile and available gas do not match."]
    ],
    prompt: "Can you explain which limits apply to your actual analyzed gas and show that your own computer settings match it?",
    sources: ["nitrox", "oxygen", "ssi"]
  },
  {
    title: "Negative entries & boat entries", category: "Entry techniques", check: 1,
    intro: "A boat entry is a coordinated operation involving the diver, buddy team, crew, and sea conditions. A negative entry means beginning the descent promptly rather than establishing the usual positive-buoyancy pause at the surface. It is a specialized choice, not a default or a shortcut.",
    sections: [
      ["Choose the method before gearing up", "Boat design, platform height, ladders, swell, traffic, and local procedures influence the entry. A giant stride, seated entry, or backward roll is appropriate only when consistent with training and the crew's instructions. Listen to the actual briefing even on a familiar vessel. Identify where divers wait, how the landing area is cleared, and who gives permission to enter. Keep clear of propellers and follow crew directions; do not assume an engine is safe because it sounds quiet."],
      ["Prepare for the transition", "Complete the buddy check and secure equipment before approaching the entry point. Discuss how cameras or other loose items are transferred, how the team confirms readiness, and what happens if a diver delays. Consider whether you can manage the equipment weight and platform movement comfortably. An entry should not be the moment you discover an unfamiliar release or breathing problem. Ask for assistance or an alternative when balance, mobility, or conditions make the planned method unsuitable."],
      ["Why negative entries need preparation", "Some operations use negative entries where surface conditions or a moving-water plan make an immediate descent desirable. That choice demands reliable coordination, equipment readiness, buoyancy skills, and an agreed response to separation or difficulty. It can reduce time to address a surface problem or reconnect with a buddy. Do not attempt one for the first time from a written description, because another diver prefers it, or because the boat is leaving. Obtain appropriate instruction and supervised practice."],
      ["The exit deserves equal attention", "Ask how the boat is approached, when equipment is removed, and where the crew wants divers to wait. Ladders and platforms can move violently in swell and create pinch or impact hazards. Keep the ladder area clear and follow the operator's spacing and assistance procedures. If an entry is postponed, equipment is adjusted, or sea conditions worsen, reassess rather than relying on the original plan. You can decline a method without needing to prove that every other diver should decline it too."]
    ],
    prompt: "What is the agreed entry, buddy-reconnection plan, and exit method, and what alternative is available if you are uncomfortable?",
    sources: ["reactivate", "ssi"]
  },
  {
    title: "Current, drift & live-boat dives", category: "Conditions · Planning", check: 1,
    intro: "Water movement can change the demands of an otherwise familiar site. Drift diving generally allows the current to carry the team along a planned route. Live-boat operations involve collection by a maneuvering vessel, making communication and surface procedures especially important.",
    sections: [
      ["Use local knowledge, not reputation", "A site's reputation for gentle drifting or spectacular current does not describe the conditions on a particular day. Tides, wind, topography, and weather can alter direction, speed, visibility, and surface conditions. Obtain a current local briefing and explain your relevant experience honestly. Discuss whether the operation offers an appropriate alternative. A strong swimmer on land is not automatically prepared for current diving, and following an experienced guide does not remove the need for suitable training and equipment."],
      ["Agree on the team's shape", "Clarify entry timing, descent arrangements, buddy positioning, route, turning or exit decisions, and separation procedures. Establish how the dive will end if a person cannot continue or the intended route becomes unsuitable. Gas use and effort can change substantially with workload, so planning must reflect the actual team. Do not pursue a photograph, animal, or isolated shelter in a way that breaks the agreed buddy plan. Communicate early rather than waiting until fatigue becomes a problem."],
      ["Surface signaling is part of preparation", "Ask what signaling equipment the operator requires, who carries it, and how each person has been trained to use it. A delayed surface marker buoy can involve entanglement and buoyancy hazards; practice belongs with appropriate instruction, not a first attempt in difficult current. Know the boat's pickup signals and expected response if the team surfaces away from the planned location. Surface visibility aids do not guarantee that a crew can see you immediately in waves or poor light."],
      ["Respect the boat and your limits", "During pickup, follow crew instructions and remain clear of the vessel's propulsion and maneuvering area. Do not swim toward an approaching boat simply because you recognize it. A current that exceeds your comfort, difficulty maintaining buddy contact, or unexpected workload is a reason to communicate and use the trained contingency plan. Avoid internet advice that promises one universal response to every current; terrain and flow patterns matter. Choose dives appropriate to your experience rather than treating challenging conditions as an informal course."]
    ],
    prompt: "How will the crew locate and collect you, and what is the plan if the current, route, or buddy contact differs from the briefing?",
    sources: ["reactivate", "ssi"]
  },
  {
    title: "Reef-hook dives", category: "Current specialty · Reef care", check: 0,
    intro: "A reef hook is a line-and-hook attachment used in some current-diving operations to hold position at a permitted attachment point. Its name is misleading: it is not permission to hook living reef, and it does not make an unsuitable current dive safe.",
    sections: [
      ["Permission and habitat come first", "Use may be prohibited entirely or restricted to particular locations and methods. Ask the operator about current local conservation rules and the suitability of the day's site. Apparently bare rock can support small or fragile life, so an attachment point cannot be judged safely from a quick distant glance. Never attach to living coral, sponges, or wildlife. If the operator cannot explain an environmentally acceptable and permitted procedure, choose another way to experience the site."],
      ["Understand the additional equipment", "A hook introduces a line, attachment, load, and release considerations. Line routing, equipment compatibility, entanglement, interaction with nearby divers, and changing tension all require instruction. Do not copy a photograph or assemble a configuration from miscellaneous clips. A system that holds you still can also complicate departure or create contact with habitat. Ask a qualified local professional to explain the configuration and have any required skills practised in an appropriate setting before relying on them."],
      ["Control is still your responsibility", "The hook does not replace buoyancy, trim, gas awareness, buddy communication, or current-diving experience. Poor positioning can allow fins and accessories to strike habitat even while the main attachment appears secure. Consider the full area around and below the diver, not merely the hook itself. Workload, surge, and current direction may vary. The team needs an agreed procedure for moving on, declining attachment, or responding if someone cannot use the system comfortably."],
      ["Avoid turning a technique into a goal", "Watching wildlife at a current-influenced site should not depend on accepting an activity beyond your qualifications or comfort. Discuss a hook-free alternative before entering if you are unsure. Do not attempt to anchor yourself with improvised equipment, attach to another diver, or reach into unknown crevices. This page intentionally does not teach attachment, loading, or release techniques. Those procedures depend on local rules, equipment, training, and conditions, and errors can harm both people and habitat."]
    ],
    prompt: "Is hook use permitted here, who will teach the specific method, and can you decline it without compromising the group's plan?",
    sources: ["reactivate", "ssi"]
  },
  {
    title: "Wreck diving & overhead limits", category: "Specialty · Wrecks", check: 5,
    intro: "A wreck can be a rewarding historical and ecological site without entering it. Exterior observation and penetration are different activities. Once a direct ascent is obstructed, navigation, gas, equipment, visibility, and emergency planning become substantially more demanding.",
    sections: [
      ["Separate the view from the route", "An open doorway or a visible patch of light does not establish that a passage is appropriate for an open-water diver. Wrecks may contain unstable structures, sharp edges, lines, cables, restricted openings, and fine sediment. Structural deterioration can change a previously visited route. Decide before the dive whether the plan remains outside the wreck and what boundaries the team will observe. Do not let a guide's presence or another person's certification silently redefine your own limits."],
      ["Exterior dives still need planning", "Depth, current, swell, fishing gear, boat traffic, and disorientation can make the outside of a wreck demanding. Follow local requirements concerning moorings, descents, ascent areas, and surface signaling. Keep clearance from metalwork and avoid disturbing sediment or marine life. A wreck's maximum depth is not necessarily the depth of your planned route, but an interesting feature is not a reason to exceed that route. Monitor gas, depth, time, and buddy contact throughout the dive."],
      ["Penetration needs specific qualification", "Different agencies and courses define wreck-diving permissions and restrictions differently. A wreck specialty label is not a universal authorization to enter every wreck. Ask what your actual qualification covers, including overhead restrictions and any environmental limits. Penetration can require specific line skills, gas planning, equipment redundancy, propulsion, communication, and team procedures. A light or a reel alone does not create those capabilities. This review does not provide penetration instructions or approve any route."],
      ["Protect history and make conservative choices", "Wrecks may be protected heritage sites, war graves, private property, or restricted hazards. Do not remove artifacts, enter closed areas, or assume that something loose is a souvenir. Report concerns through the operator. If visibility decreases, equipment behaves unexpectedly, or the planned exterior route cannot be maintained, communicate and act within trained contingency procedures. Plan the return, ascent, and surface support before entering the water, not after reaching the most interesting part of the wreck."]
    ],
    prompt: "Does your planned route remain genuinely open water, and what does your specific qualification permit at this wreck?",
    sources: ["wreck", "deep", "ssi"]
  },
  {
    title: "Cavern & cave diving", category: "Overhead · Separate training", check: 5,
    intro: "Cavern and cave environments can look inviting precisely because the entrance is bright and the water is clear. Their central difference from open water is the overhead: a direct ascent may be impossible. Visibility and a guide do not remove that fundamental constraint.",
    sections: [
      ["Daylight is not a complete qualification", "A cavern is not simply any cave where some light is visible. Programs and local rules define limits involving daylight, route, depth, distance, and configuration. Those definitions should come from current training and the operator, not a photograph or a general website. A lighted opening farther along a route does not prove that the passage is a safe exit. Never cross a cavern boundary or follow a guide into a cave zone without the required qualifications and plan."],
      ["Clear water can hide fragile conditions", "Fine sediment, restricted passages, darkness, entanglement, and complex routes can turn an apparently simple excursion into a serious problem. A diver's movement or equipment contact can reduce visibility quickly. Some environments have flow, temperature layers, or water chemistry that require additional local understanding. Familiarity with open-water navigation does not establish competence in overhead navigation. A second torch and confidence are not substitutes for specific training, supervised experience, and an appropriate team."],
      ["Understand what the operator is offering", "Some locations offer guided cavern experiences under specific local or agency standards. Clarify eligibility, group size, guide qualifications, equipment requirements, environmental limits, and whether the route remains within those standards. Do not interpret a commercial booking as evidence that every overhead is suitable for your certification. Ask for the cancellation and alternative-dive policy if you are uncomfortable. The decision should consider your recent control and comfort, not only the certification card in your wallet."],
      ["Cave training is a separate pathway", "Cave-diving instruction develops specialized navigation, guideline, gas, propulsion, equipment, communication, and emergency competencies. These skills depend on structured practice and assessment; they cannot be taught responsibly by a short reading page. This hub supplies no line-following shortcut, reserve fraction, or lost-line procedure. Keep the entry and exit plan within your actual training and protect fragile formations and ecosystems. Declining an overhead dive is an appropriate choice even when other members of the group are enthusiastic."]
    ],
    prompt: "What exact environmental boundaries apply to the offered experience, and who has verified that your qualifications and recent skills meet them?",
    sources: ["wreck", "reactivate", "ssi"]
  },
  {
    title: "Night & fluoro dives", category: "Specialty · Low light", check: 1,
    intro: "After dark, a familiar reef can feel unfamiliar. Visual references change, equipment tasks become harder, and wildlife behaves differently. Fluorescence diving adds excitation lights and viewing filters, creating another layer of equipment and observation needs rather than a separate set of basic safety rules.",
    sections: [
      ["Plan for darkness above and below", "Choose a site and conditions appropriate to your night-diving training and recent experience. The briefing should cover entry, route, orientation, buddy spacing, communication, ascent, exit, and how the team is recognized at the surface. Shore landmarks and ladders may be difficult to identify in darkness. Ask what happens if the main light fails or the group cannot maintain contact. A daytime visit is helpful, but it does not establish that night conditions will be identical."],
      ["Treat lighting as essential equipment", "Use suitable dive lights and backups according to the course, environment, and operator requirements. Check operation, battery readiness, controls, and attachment before entering. Agree on light signals and ordinary hand-signal illumination without shining lights into another diver's eyes. Do not assume a camera focus light replaces the required lighting arrangement. If equipment is unfamiliar, obtain instruction and practice before the dive rather than trying to identify switches while buoyancy, navigation, and buddy contact compete for attention."],
      ["Fluorescence needs a clear briefing", "Fluoro systems use particular illumination and filters to reveal fluorescence that ordinary white light may mask. A filter can change how equipment and surroundings appear. Ask how normal navigation, computer reading, communication, and exits remain visible and what white-light capability is required. Equipment combinations are not universal; follow the supplied system's instructions. Do not turn off needed lights or remove essential awareness merely to improve the visual effect. The experience remains a dive with all the usual planning responsibilities."],
      ["Observe nocturnal life gently", "Some animals rest at night and others feed or move. Avoid prolonged illumination, crowding, touching, or provoking an animal, and follow local restrictions on flash and excitation lighting. Keep fins and camera accessories clear of habitat, especially when attention narrows to a small subject. Strong current, unfamiliar equipment, photography, and darkness can create excessive task loading together. Select an easier plan or additional training when needed rather than assuming that following a beam of light is enough."]
    ],
    prompt: "Can the team communicate, navigate, and exit if the photographic or fluorescence setup stops working?",
    sources: ["night", "reactivate", "ssi"]
  },
  {
    title: "Muck & macro", category: "Specialty · Small wonders", check: 0,
    intro: "Muck diving explores habitats that may look plain from a distance: sand, rubble, silt, or mixed substrate. Macro observation and photography focus on small subjects. These places are living environments, not empty platforms on which a diver can kneel or rearrange a scene.",
    sections: [
      ["Slow observation reveals more", "A patient guide may help you recognize animals that resemble leaves, rubble, or the bottom itself. Identification should remain observational: many animals are delicate, camouflaged, venomous, or difficult to distinguish. Do not lift debris, turn rocks, move animals, or put fingers into shelters to obtain a view. An apparently abandoned shell or piece of litter may be occupied. Ask the guide about a subject's sensitivity and maintain a distance that permits its normal behavior."],
      ["Keep sediment and equipment controlled", "Fine substrate can be disturbed easily, affecting visibility and habitat. Appropriate buoyancy, trim, and propulsion matter more than proximity to the animal. Choose methods within your training and seek practice if you cannot remain clear without support. Secure hoses, gauges, lights, and camera arms. A pointer stick is not automatic permission to touch the bottom; its use may be restricted and can injure concealed life. Never place hands or knees where you cannot identify what lies beneath them."],
      ["Manage the camera's extra demands", "Small subjects can absorb attention until gas, depth, time, position, and the buddy disappear from awareness. Agree on how the team waits, shares viewing time, and communicates. Do not pursue a photo beyond the route, limits, or comfort of the team. Settings and lighting can be prepared before approaching the subject to reduce repeated disturbance. If control is deteriorating, stop photography and concentrate on the dive rather than assuming one more frame will justify the effort."],
      ["A good image does not require intervention", "Avoid feeding, baiting, moving, holding, or exposing an animal for a more dramatic composition. Follow site restrictions on flash and light, limit repeated attention, and allow other divers space without crowding the subject. Be cautious about sharing exact locations of particularly vulnerable animals. Responsible image captions should not imply behavior that was staged. The most successful encounter may be one where you take no photograph because obtaining it would disturb the animal or compromise dive control."]
    ],
    prompt: "Can you observe the subject while leaving its location, shelter, behavior, and surrounding sediment unchanged?",
    sources: ["reactivate", "ssi"]
  },
  {
    title: "Dry suit & cold-water diving", category: "Specialty · Thermal protection", check: 3,
    intro: "A dry suit provides an insulating system when used with appropriate undergarments, but it also introduces a gas space and specialized controls. Cold water adds exposure, dexterity, and equipment considerations. A new suit is not a substitute for dry-suit instruction and supervised familiarization.",
    sections: [
      ["Think of insulation as a complete system", "Water temperature, duration, activity, fit, undergarments, seals, hood, and gloves all affect comfort. A suit that keeps water out does not automatically provide enough insulation. Restrictive clothing, leaking seals, or inadequate protection can change the dive's demands. Plan surface exposure as well as time underwater: wind, wet equipment, and waiting on a boat can continue cooling. Choose equipment suited to the actual conditions and discuss circulation, mobility, and medical concerns with qualified advisers."],
      ["Learn the suit's controls and behavior", "Inflation and exhaust arrangements, gas movement, weighting, and buoyancy procedures vary with the suit and training system. Follow the manufacturer's instructions and the method taught by your instructor; a simple sentence about using the BCD or suit cannot cover every configuration. Familiarize yourself with valves, connections, closures, and how accessories affect access. Practise required skills in a controlled setting. This article does not teach inversion recovery, valve-failure management, or an uncontrolled-ascent response."],
      ["Prepare equipment for the environment", "Regulators and other equipment must be appropriate for cold-water use according to their manufacturers. Cold can affect battery performance, breathing systems, and the dexterity needed to operate clips, releases, and computers. A buddy check should account for gloves and unfamiliar releases. Service history and correct environmental suitability matter more than whether equipment worked on a warm-water holiday. Ask the operator about local gas and equipment practices rather than applying an improvised freeze-prevention technique."],
      ["Make comfort part of the dive-ending plan", "Shivering, reduced dexterity, discomfort, or difficulty thinking clearly should not be dismissed as proof that someone lacks toughness. Communicate early and follow the agreed plan for ending the dive and obtaining assistance. Warmth afterward does not rule out every diving injury; new or concerning symptoms merit professional assessment. Avoid adding current, depth, photography, and a first dry-suit experience all at once. Match the day's task load to your actual recent skills, not just a certification from years ago."]
    ],
    prompt: "Have you practised in this suit and insulation system, and can both buddies operate essential equipment while wearing their actual gloves?",
    sources: ["dry", "dci", "ssi"]
  },
  {
    title: "Shark cage experiences", category: "Wildlife · Surface activity", check: 0,
    intro: "Shark cage activities vary widely. Some use surface cages and breath-hold viewing, some provide surface-supplied breathing equipment, and others involve submerged cages with scuba. They should not all be described as ordinary recreational scuba dives or assumed to have the same eligibility requirements.",
    sections: [
      ["Identify the exact activity", "Ask the operator whether the cage remains at the surface, what breathing system is used, and whether diving certification is required. Clarify access, time in the cage, water temperature, visibility, sea conditions, and the physical demands of boarding and exiting. A marketing phrase such as 'no experience needed' does not answer questions about health screening, supervision, or emergency arrangements. If underwater breathing equipment is involved, the operator must explain the applicable instruction, eligibility, and supervision standards."],
      ["Choose an accountable operator", "Check current permits, local regulations, staff qualifications relevant to the activity, emergency arrangements, and the operator's conservation approach. Ask how cage integrity and operating equipment are inspected and how weather decisions are made. An encounter should never depend on entering the water outside the approved setup. Do not assume that the presence of a cage removes risks from the sea, vessel movement, sharp equipment, or a large animal. Respect closures and protected-area requirements."],
      ["Keep boundaries physical and behavioral", "Follow the operator's instructions on where hands, feet, cameras, and accessories may be placed. Do not extend equipment or body parts through openings to obtain a close-up encounter, and do not touch or provoke sharks. Different species and jurisdictions have different management rules. Attraction and provisioning practices deserve careful scrutiny for legality and welfare impacts; choose operators whose practices you can understand and support. Decline participation if the operation encourages harassment or unsafe behavior."],
      ["Prepare for the whole boat trip", "Motion sickness, cold, sun exposure, wet decks, and handling heavy equipment may affect people even when the activity is described as easy. Discuss suitable precautions with qualified professionals rather than borrowing another participant's medication. Know how to signal discomfort and request to leave the cage. A photography goal should not override an instruction from the crew. Be honest about what the experience involved when sharing images: surface cage viewing is not evidence of independent scuba competence or shark-diving certification."]
    ],
    prompt: "What breathing system, supervision, welfare rules, and emergency procedures apply to the specific cage activity you have booked?",
    sources: ["reactivate", "ssi"]
  },
  {
    title: "Deep & altitude dives", category: "Specialty · Conservative limits", check: 5,
    intro: "Depth and altitude change planning in different ways. At depth, gas density, gas consumption, narcosis, and decompression considerations can become more demanding. At altitude, lower surface pressure changes pressure relationships and requires appropriate planning methods and equipment settings.",
    sections: [
      ["Depth reduces room for improvisation", "A deeper dive may increase gas consumption at the same breathing effort and leave less time within no-stop limits. Task loading, cold, poor visibility, and an unfamiliar descent can add difficulty. Narcosis can affect judgment; feeling comfortable is not proof that judgment is unaffected. Stay within the limits of your actual certification and experience, and obtain deep-diving training where appropriate. A computer displaying available time is not permission to exceed a qualification or follow an unsuitable profile."],
      ["Build a dive-specific plan", "Route, gas, exposure, descent and ascent arrangements, buddy procedures, and contingencies need to match the environment. Discuss the team's least experienced member rather than assuming the most experienced diver sets an appropriate limit for everyone. An interesting wreck feature or animal sighting is not a reason to extend a planned depth. This hub does not supply a universal gas reserve, ascent schedule, or decompression plan. Planned decompression and technical activities require separate competencies and equipment."],
      ["Altitude is more than changing units", "A high-altitude lake has lower surface atmospheric pressure than the sea. Travel to the site, acclimatization, repetitive dives, and the computer or table method all need consideration. Follow the equipment manufacturer's altitude instructions and appropriate training; do not assume every device automatically compensates in every operating state. Local visibility, temperature, access, and rescue logistics may also differ sharply from coastal diving. Seek qualified local guidance instead of adapting an ordinary sea-level plan by guesswork."],
      ["Remember the journey after the dive", "A drive over a mountain pass or a flight can expose you to reduced ambient pressure after diving. Discuss the actual itinerary before choosing the last dive, and follow appropriate current guidance and your computer's restrictions. DAN's flying-after-diving recommendations distinguish different dive histories and apply to specified circumstances; a single timer is not a guarantee of safety. If symptoms suggest a diving injury, seek urgent medical advice rather than waiting for a no-fly countdown to expire or boarding a flight."]
    ],
    prompt: "Have you considered both the underwater profile and every altitude exposure on the journey to and from the dive site?",
    sources: ["deep", "flying", "dci", "ssi"]
  },
  {
    title: "Shore entries, surf & low visibility", category: "Conditions · Local briefing", check: 1,
    intro: "An entry that looks straightforward from a car park may change with tide, swell, surge, footing, or visibility. Shore diving also requires planning for the return to land. Low visibility removes visual references and can make familiar tasks much more demanding.",
    sections: [
      ["Inspect both entry and exit", "Obtain a local briefing and observe conditions before committing. Slippery rock, unstable gravel, steep beaches, wave timing, tidal access, and a difficult climb with equipment can affect suitability. Establish where the team will exit and what happens if that route is unavailable. A calm entry does not guarantee a calm return. Check access permissions, daylight, surface support, and whether the route fits everyone's mobility and equipment. Arrange an alternative rather than assuming determination will compensate for a difficult shoreline."],
      ["Surf requires actual instruction", "There is no universal surf-entry sequence suitable for every beach, wave pattern, or equipment arrangement. Waves can knock a diver down, move loose equipment, or make a regulator and mask difficult to manage. Get local professional instruction and select conditions within your ability. Do not learn surf techniques by trial and error while carrying unfamiliar equipment. An operator's instruction to postpone is not an inconvenience to work around; worsening conditions are a legitimate reason to choose another site."],
      ["Prepare for reduced references", "Suspended sediment, plankton, poor light, and disturbed bottom material can limit visibility. Agree on appropriate buddy spacing, communication, route, and separation procedures within your training. Familiarity with navigation equipment is useful, but a compass cannot replace depth, gas, position, and team awareness. Avoid increasing the problem by contacting the bottom. If contact and orientation cannot be maintained as planned, communicate and use trained contingency procedures rather than pressing onward in search of better scenery."],
      ["Keep the surface operation organized", "Know how local boat traffic is managed and which flags or surface markers are legally required. Equipment signals presence but does not guarantee protection from every vessel. Arrange a reliable way to summon help and provide rescuers with the actual site location and access route. Keep shore belongings and car keys secure without compromising emergency access. After a demanding exit, account for every diver and assess whether fatigue, cold, or conditions justify cancelling another dive instead of repeating the original plan automatically."]
    ],
    prompt: "Could you still exit safely if conditions worsen, and does everyone understand what to do if visibility or buddy contact deteriorates?",
    sources: ["reactivate", "ssi"]
  },
  {
    title: "Photography & marine-life etiquette", category: "Conservation · All dives", check: 0,
    intro: "A camera can deepen observation, but it also narrows attention and adds equipment. Good underwater photography begins with dive control and respect for the subject. An image is not worth damaging habitat, disturbing wildlife, or losing track of your buddy and dive limits.",
    sections: [
      ["Put diving ahead of the photograph", "Become comfortable with buoyancy, trim, propulsion, and equipment before adding a camera. Check the housing and prepare settings in a suitable place before approaching a subject. Secure accessories without creating entanglement or making essential equipment inaccessible. Agree with your buddy how photographs will fit the route and communication plan. If depth, gas, position, or comfort becomes difficult to monitor, stop taking pictures and concentrate on the dive rather than trying to finish a sequence first."],
      ["Let the animal control the encounter", "Do not touch, chase, feed, restrain, move, or provoke wildlife for an image. Keep exits, breathing access, and normal travel routes clear. An animal remaining still is not proof that it is undisturbed. Follow guide instructions and local species-specific distances rather than assuming a single distance suits every encounter. If an animal moves away or the guide asks you to withdraw, let the encounter end. Photographing a sensitive subject is optional; respectful behavior is not."],
      ["Protect what surrounds the subject", "Keep fins, knees, hands, and camera arms clear of coral and other habitat. Avoid stirring sediment or moving rocks and debris to reveal an animal. Flash, video lighting, and repeated close attention may be restricted for particular sites or species. Follow the more protective local requirement rather than arguing that an equipment setting makes disturbance impossible. Limit crowding and allow other divers an unobstructed view without forming a ring that traps the animal or prevents the group from moving safely."],
      ["Share images responsibly", "Obtain permission before publishing identifiable people where appropriate, respect photographers' ownership, and describe the location and circumstances honestly. Avoid revealing precise locations of vulnerable wildlife when conservation guidance advises against it. Do not present staged behavior as a natural encounter. Choose a missed photograph over a harmful interaction, and report concerning practices through an appropriate operator or conservation channel. Image quality improves with patient observation and suitable practice, not by treating the reef as a studio that can be rearranged."]
    ],
    prompt: "Could you make this image without changing the animal's position, behavior, shelter, or access to open water?",
    sources: ["reactivate", "ssi"]
  },
  {
    title: "Emergency skills & post-dive planning", category: "Safety · Refresh with an instructor", check: 6,
    intro: "Emergency readiness is built before a problem occurs: refreshed skills, suitable equipment, a shared plan, and access to help. Written knowledge can identify gaps, but it cannot establish that a diver can manage a real emergency. Arrange supervised practice appropriate to your certification and recent experience.",
    sections: [
      ["Refresh skills in a suitable setting", "Tell an instructor which responses feel unfamiliar, including alternate breathing arrangements, mask skills, buoyancy problems, assistance, and surface signaling. Practise according to your training in an environment appropriate to the skill, not by surprising a buddy during an ordinary dive. Rescue, CPR, first aid, and oxygen-provider training each develop different competencies. Renew them as appropriate and understand who on the trip holds those skills. Do not assume a dive leader can perform every role simultaneously."],
      ["Make the emergency plan specific", "Know how to contact local emergency services, report the site's position, and arrange evacuation. Check communications coverage, access, surface support, oxygen availability, first-aid equipment, and staff competence. Insurance and remote-location arrangements should be understood before travel. A nearby chamber symbol on a map does not establish that the facility is available or appropriate; emergency services and diving-medicine advisers should coordinate referral. Everyone should know how to raise an alarm without depending on one person's locked phone."],
      ["Take new symptoms seriously", "Decompression illness can occur even after a dive that appeared to stay within limits. New pain, weakness, unusual numbness, dizziness, breathing difficulty, confusion, or other concerning symptoms after diving warrant prompt professional assessment; this is not an exhaustive checklist. Activate local emergency services for serious or suspected diving injury and seek diving-medicine advice. Trained responders should provide appropriate first aid and emergency oxygen when indicated and available. Do not delay care because symptoms improve, and never attempt self-directed in-water recompression."],
      ["Plan the period after surfacing", "Account for the team, communicate concerns, and retain relevant dive-computer information for clinicians if needed. Follow current guidance for flying and altitude exposure after diving, taking the actual dive history and any symptoms into account. A no-fly display is not a medical clearance. If you feel unwell, do not treat another dive, a flight, alcohol, or an internet diagnosis as a solution. Returning to diving after illness or injury may require assessment by an appropriately qualified clinician and a reviewed training plan."]
    ],
    prompt: "Who calls for help, what location will they give, where is emergency equipment, and when did you last practise the relevant skills?",
    sources: ["dci", "flying", "reactivate", "ssi"]
  }
];

const knowledgeSources = {
  reactivate: { label:"PADI ReActivate — public program overview", url:"https://www.padi.com/courses/reactivate" },
  ssi: { label:"SSI — official training center and program directory; confirm current course standards with your instructor", url:"https://www.divessi.com/" },
  nitrox: { label:"PADI Enriched Air Diver — public course overview", url:"https://www.padi.com/courses/enriched-air-diver" },
  oxygen: { label:"DAN — Oxygen Toxicity", url:"https://dan.org/health-medicine/health-resources/diseases-conditions/oxygen-toxicity/" },
  dry: { label:"PADI Dry Suit Diver — public course overview", url:"https://www.padi.com/courses/dry-suit-diver" },
  wreck: { label:"PADI Wreck Diver — public course overview", url:"https://www.padi.com/courses/wreck-diver" },
  night: { label:"PADI Night Diver — public course overview", url:"https://www.padi.com/courses/night-diver" },
  deep: { label:"PADI Deep Diver — public course overview", url:"https://www.padi.com/courses/deep-diver" },
  flying: { label:"DAN — Flying After Diving", url:"https://dan.org/health-medicine/health-resources/diseases-conditions/flying-after-diving/" },
  dci: { label:"DAN — Decompression Illness", url:"https://dan.org/health-medicine/health-resources/diseases-conditions/decompression-illness-what-is-it-and-what-is-the-treatment/" }
};

const topicList = document.getElementById("topic-library");
const topicArticle = document.getElementById("topic-article");
const topicCategories = [
  { title: "Dive essentials", description: "Build good habits, understand your equipment, and plan with your buddy.", topics: [0, 1, 2, 15] },
  { title: "Entries & environments", description: "Prepare for different entries, changing conditions, and unfamiliar waters.", topics: [3, 4, 10, 12, 13] },
  { title: "Specialist adventures", description: "Explore what additional training and preparation these dives demand.", topics: [6, 7, 8] },
  { title: "Marine life & reef care", description: "Discover more while leaving wildlife and habitats undisturbed.", topics: [5, 9, 11, 14] }
];
const topicGrids = new Map();
topicCategories.forEach((category, index) => {
  const section = document.createElement("section");
  section.className = "topic-category";
  const heading = document.createElement("h2");
  heading.id = `library-category-${index}`;
  heading.textContent = category.title;
  section.setAttribute("aria-labelledby", heading.id);
  const description = document.createElement("p");
  description.textContent = category.description;
  const grid = document.createElement("div");
  grid.className = "topic-category-grid";
  section.append(heading, description, grid);
  topicList.append(section);
  category.topics.forEach(topicIndex => topicGrids.set(topicIndex, grid));
});
knowledgeTopics.forEach((topic, index) => {
  const button = document.createElement("button");
  button.className = "topic-card";
  button.dataset.topicIndex = String(index);
  const copy = document.createElement("span");
  copy.className = "topic-card-copy";
  const number = document.createElement("span");
  number.className = "eyebrow";
  number.textContent = String(index + 1).padStart(2, "0");
  const title = document.createElement("strong");
  title.textContent = topic.title;
  const category = document.createElement("span");
  category.textContent = topic.category;
  copy.append(number, title, category);
  const picture = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  picture.setAttribute("viewBox", "0 0 100 120");
  picture.setAttribute("class", "topic-picture");
  picture.setAttribute("aria-hidden", "true");
  const artwork = document.createElementNS("http://www.w3.org/2000/svg", "use");
  artwork.setAttribute("href", `topic-pictures.svg#topic-${index}`);
  picture.append(artwork);
  button.append(copy, picture);
  button.addEventListener("click", () => {
    topicArticle.replaceChildren();
    const back = document.createElement("button");
    back.className = "text-button";
    back.textContent = "← Dive library";
    back.addEventListener("click", () => {
      topicArticle.hidden = true;
      topicList.hidden = false;
      button.focus();
    });
    const label = document.createElement("p");
    label.className = "eyebrow";
    label.textContent = `${String(index + 1).padStart(2, "0")} / ${topic.category}`;
    const heading = document.createElement("h2");
    heading.tabIndex = -1;
    heading.textContent = topic.title;
    const intro = document.createElement("p");
    intro.className = "topic-intro";
    intro.textContent = topic.intro;
    topicArticle.append(back, label, heading, intro);
    topic.sections.forEach(([titleText, body]) => {
      const section = document.createElement("section");
      const heading = document.createElement("h3");
      heading.textContent = titleText;
      const paragraph = document.createElement("p");
      paragraph.textContent = body;
      section.append(heading, paragraph);
      topicArticle.append(section);
    });
    const prompt = document.createElement("p");
    prompt.className = "topic-prompt";
    prompt.textContent = `Before your next dive: ${topic.prompt}`;
    const disclaimer = document.createElement("p");
    disclaimer.className = "editor-note";
    disclaimer.textContent = "Independent reading draft · Compiled 15 October 2026 · Not instructor-reviewed. Not an official PADI/SSI lesson, complete operating procedure, medical assessment, or qualification. Follow current training, manufacturer instructions, and local rules. Links below are further reading; program summaries are not technical standards or evidence of endorsement.";
    const sources = document.createElement("div");
    sources.className = "topic-sources";
    topic.sources.forEach(key => {
      const source = knowledgeSources[key];
      const link = document.createElement("a");
      link.href = source.url;
      link.textContent = source.label + " ↗";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      sources.append(link);
    });
    const check = document.createElement("button");
    check.className = "button";
    check.textContent = "Try a related knowledge check →";
    check.addEventListener("click", () => {
      const select = document.getElementById("quiz-topic");
      select.value = String(topic.check);
      select.dispatchEvent(new Event("change"));
      document.querySelector(".reef-quiz").scrollIntoView({ behavior:"smooth", block:"start" });
      select.focus({ preventScroll:true });
    });
    topicArticle.append(prompt, disclaimer, sources, check);
    topicList.hidden = true;
    topicArticle.hidden = false;
    topicArticle.scrollIntoView({ behavior:"instant", block:"start" });
    heading.focus({ preventScroll:true });
  });
  topicGrids.get(index).append(button);
});
