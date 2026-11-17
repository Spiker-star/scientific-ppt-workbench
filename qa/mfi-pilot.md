# MFI one-slide pilot / 单页试验记录

Source: Zhang et al., Journal of Membrane Science 389 (2012) 451–458. DOI 10.1016/j.memsci.2011.11.013. User-provided PDF stays local.

Evidence checks: 92.1% combined PX selectivity and 6.5% MX conversion at 270 C match abstract and printed page 455. Feed/sweep He 20 mL/min matches Fig.5. Structure and mechanism paraphrase pp.453–455, Fig.4. Limited catalytic sites match conclusion p.457. Schematic is conceptual, not to scale. Selectivity is combined products, not permeate purity.

Artifact checks: exactly 1 slide; 24 native shapes/text objects; no raster image objects. Exported PPTX XML contains both headline values. Preview inspected at 1280x720 with no observed clipping. Native diagram and text can be edited individually. Microsoft PowerPoint application compatibility/editing remains user acceptance, not tested here.

Scope: PASS for PDF reading, evidence-based summarization, editable authoring, preview/export and GitHub versioning. NOT a PaperBanana or Academic Figure Skills runtime test. Neither upstream pipeline nor external API was installed or called. Existing pinned manifests do not certify dependency safety.

Reproduce: in Codex with the bundled artifact session tool, execute slides/mfi-pilot.session.js inside artifact-session JavaScript, then export with presentation.export({format:'pptx'}) inside a subsequent artifactSession.run callback on the returned artifactRef. This is an application-session script, not a standalone Node command. Recheck preview and evidence after any edit.
