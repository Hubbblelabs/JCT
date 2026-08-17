import type { ReactNode } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Compass,
  DatabaseBackup,
  FileEdit,
  GraduationCap,
  Image as ImageIcon,
  LifeBuoy,
  ListChecks,
  Map as MapIcon,
  MousePointerClick,
  Send,
  ShieldCheck,
  Table,
  Users,
} from "lucide-react";
import type { AdminNavIcon, AdminRole } from "@/lib/admin-nav";
import { visibleGroups, visibleSections } from "@/lib/admin-nav";
import { hasMinRole } from "@/lib/permissions";
import {
  Bullets,
  Card,
  Cards,
  Defs,
  H3,
  Key,
  Note,
  P,
  Steps,
  UI,
} from "./pieces";

/**
 * The admin panel's user manual.
 *
 * Written for the staff who run the site, not for developers: no environment
 * variables, no code, no collection names. Where a fact here mirrors a
 * behaviour in the panel, the behaviour is the source of truth — if you change
 * how saving works, this file changes with it.
 *
 * Chapters are plain data so the page can build its own contents list, filter
 * by search, and hide the admin-only chapters from editors without either
 * half drifting from the other.
 */

export type HelpContext = {
  role: string;
  institution: string;
};

export type HelpChapter = {
  /** Anchor id — also the deep link, e.g. /admin/help#publishing */
  id: string;
  title: string;
  icon: AdminNavIcon;
  /** One line, shown under the title in the contents list. */
  summary: string;
  /** Hidden from anyone below this role. */
  minRole?: AdminRole;
  /** Extra words the search box should match — synonyms staff actually use. */
  keywords: string;
  body: (ctx: HelpContext) => ReactNode;
};

/* ═══════════════════════════════════════════════════════════════════════════
   Screen reference — built from the navigation registry
   ═══════════════════════════════════════════════════════════════════════════

   Generated rather than written out, so a page added to the sidebar is
   documented the moment it appears there. A hand-written list would be wrong
   by the next release, and wrong documentation is worse than none. */

function ScreenReference({ role, institution }: HelpContext) {
  const sections = visibleSections(role, institution);

  return (
    <>
      <P>
        Every screen you can open, in sidebar order, with what it changes on the
        public site. This list is generated from the sidebar itself, so it can
        never fall out of step with it — and it already hides anything your
        account is not allowed to open.
      </P>

      {sections.map((section) => (
        <div key={section.id} className="admin-doc-screens">
          <h3 className="admin-doc-h3">
            <section.icon size={15} aria-hidden="true" />
            {section.label}
          </h3>
          <p className="admin-doc-p">{section.description}</p>

          {visibleGroups(section, role).map((group) => (
            <div key={group.title} className="admin-doc-screen-group">
              <p className="admin-doc-screen-group-title">{group.title}</p>
              <ul className="admin-doc-screen-list">
                {group.items.map((item) => (
                  <li key={item.href} className="admin-doc-screen">
                    <item.icon
                      size={14}
                      className="admin-doc-screen-icon"
                      aria-hidden="true"
                    />
                    <Link href={item.href} className="admin-doc-screen-link">
                      {item.label}
                    </Link>
                    <span className="admin-doc-screen-desc">
                      {item.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Chapters
   ═══════════════════════════════════════════════════════════════════════════ */

export const HELP_CHAPTERS: HelpChapter[] = [
  /* ── 1. Start here ──────────────────────────────────────────────────────*/
  {
    id: "start",
    title: "Start here",
    icon: BookOpen,
    summary: "What this panel is, how to sign in, and the one habit to keep.",
    keywords:
      "login sign in password session logout account locked out first time introduction overview",
    body: ({ role }) => (
      <>
        <P>
          This panel is where the JCT website is written. Everything a visitor
          reads — the home page, each college&apos;s pages, programs, news,
          blogs, placements, downloads — is stored here and published from here.
          Nothing on the public site is edited anywhere else.
        </P>

        <H3>Signing in</H3>
        <Steps>
          <li>
            Go to <UI>/admin/login</UI> and enter the email and password you
            were given.
          </li>
          <li>
            You stay signed in for 24 hours. After that the panel asks for the
            password again — that is normal, not a fault.
          </li>
          <li>
            To sign out, open the menu with your name at the top right and
            choose <UI>Sign out</UI>.
          </li>
        </Steps>
        <P>
          After several wrong passwords in a row the panel stops accepting
          attempts for a few minutes. Wait, then try again — or ask an admin to
          set a new password for you.
        </P>

        <H3>What your account can do</H3>
        <P>There are two kinds of account.</P>
        <Defs
          rows={[
            {
              term: "Editor",
              body: "Works on one college only. Sees that college's pages plus Dynamic Pages, and cannot open another college's content, the site-wide settings, the people list, the audit log or the backups.",
            },
            {
              term: "Admin",
              body: "Sees and edits everything: all three colleges, the main website, the site-wide elements, plus people, the audit log and backup & restore.",
            },
          ]}
        />
        <P>
          You are signed in as{" "}
          <strong>{role === "admin" ? "an admin" : "an editor"}</strong>. This
          manual hides the chapters your account cannot use, so everything below
          applies to you.
        </P>

        <H3>The one habit worth keeping</H3>
        <Note tone="warning" title="Check the breadcrumb before you type">
          The three colleges share the same screens. <UI>Hero</UI> for
          Engineering and <UI>Hero</UI> for Polytechnic look identical. The line
          at the top of the window —{" "}
          <UI>Engineering College › Landing Page › Hero</UI> — is what tells
          them apart. Read it before you edit, and you will never publish one
          college&apos;s copy onto another.
        </Note>
      </>
    ),
  },

  /* ── 2. Finding your way ────────────────────────────────────────────────*/
  {
    id: "navigate",
    title: "Finding your way around",
    icon: Compass,
    summary: "The sidebar, the breadcrumb, search, and viewing the live site.",
    keywords:
      "sidebar menu navigation breadcrumb search ctrl+k command palette collapse mobile drawer dashboard layout",
    body: () => (
      <>
        <H3>The sidebar</H3>
        <P>
          Everything lives in the tree on the left. It is grouped by{" "}
          <em>which site</em> the content belongs to — the site-wide elements
          first, then the main website, then each college. Click a section to
          open it; opening one closes the others, so the list stays short.
        </P>
        <P>
          Inside a college there are two groups. <UI>Landing Page</UI> lists the
          blocks of that college&apos;s front page{" "}
          <em>in the order a visitor scrolls past them</em>, so reading the
          sidebar top to bottom walks the real page top to bottom.{" "}
          <UI>Other Pages</UI> is everything else that college publishes.
        </P>

        <H3>The breadcrumb</H3>
        <P>
          The line across the top always says where you are:{" "}
          <UI>section › group › page</UI>. It is the only thing on screen that
          distinguishes one college&apos;s copy of a screen from another&apos;s.
        </P>

        <H3>Search</H3>
        <P>
          Press <Key>Ctrl</Key> <Key>K</Key> (<Key>⌘</Key> <Key>K</Key> on a
          Mac) anywhere in the panel, or click <UI>Search pages…</UI> in the top
          bar. Type a few letters of a page name, move with the arrow keys,
          press <Key>Enter</Key> to go. <Key>Esc</Key> closes it. This is
          usually faster than clicking through the tree.
        </P>

        <H3>Seeing the real page</H3>
        <Bullets>
          <li>
            The <MousePointerClick size={13} aria-hidden="true" /> external-link
            button in the top bar opens the public website in a new tab.
          </li>
          <li>
            The live-preview editors have their own <UI>Public Page</UI> button
            that opens the exact page you are editing.
          </li>
        </Bullets>

        <H3>More room to work</H3>
        <P>
          The button at the far left of the top bar collapses the sidebar to a
          narrow strip of icons; hover it to see the names again. On the
          live-preview editors it collapses on its own, so the preview gets the
          width. On a phone the sidebar becomes a drawer that closes as soon as
          you pick a destination.
        </P>
      </>
    ),
  },

  /* ── 3. Publishing ──────────────────────────────────────────────────────*/
  {
    id: "publishing",
    title: "How saving and publishing work",
    icon: Send,
    summary:
      "The most important chapter — which Save buttons change the live site.",
    keywords:
      "save publish draft live unpublished go live status badge visible hidden preview cache stale not updating",
    body: () => (
      <>
        <P>
          Screens in this panel save in one of four ways. Which one you are
          looking at decides whether pressing <UI>Save</UI> changes what
          visitors see <em>right now</em>. Learn the four and nothing in the
          panel can surprise you.
        </P>

        <Cards>
          <Card
            title="1 · Section forms"
            badge={
              <span className="admin-badge admin-badge-published">
                Save = live
              </span>
            }
          >
            <p>
              A single gold <UI>Save</UI> button at the top right, one form
              below it.
            </p>
            <p>
              <strong>Saving publishes immediately.</strong> There is no draft
              step. These are the screens reached from a college&apos;s
              <UI>Landing Page</UI> group and from <UI>Global CMS</UI> — Navbar,
              Hero, Admissions, Life at JCT, Footer, Floating Elements, the
              Pamphlet popup and so on.
            </p>
          </Card>

          <Card
            title="2 · Live-preview editors"
            badge={
              <span className="admin-badge admin-badge-draft">
                Save = draft
              </span>
            }
          >
            <p>
              The real public page fills the screen and you click a section to
              edit it. Two buttons:
            </p>
            <p>
              <UI>Save</UI> keeps your work as a draft — the live page does not
              change. <UI>Save &amp; Publish</UI> makes it live. Use this for
              About Us, Centre of Excellence, Campus Life, Research, Clubs,
              Committees, Accreditations, Reports &amp; Downloads, NAAC,
              Placements and every standalone content page.
            </p>
          </Card>

          <Card
            title="3 · Programs and Dynamic Pages"
            badge={
              <span className="admin-badge admin-badge-draft">
                Save = draft
              </span>
            }
          >
            <p>
              Same two buttons, plus a badge near the title showing{" "}
              <span className="admin-badge admin-badge-draft">Draft</span> or{" "}
              <span className="admin-badge admin-badge-published">
                Published
              </span>
              .
            </p>
            <p>
              A record can be published <em>and</em> hold a newer draft at the
              same time: visitors keep reading the published version until you
              press <UI>Save &amp; Publish</UI> again.
            </p>
          </Card>

          <Card
            title="4 · Lists"
            badge={
              <span className="admin-badge admin-badge-published">
                Save = live
              </span>
            }
          >
            <p>
              News &amp; Events, Blogs, Testimonials, Recruiters and the
              year-wise placement records.
            </p>
            <p>
              These have no draft. Saving a row writes it through. To keep
              something off the site, set it to{" "}
              <span className="admin-badge admin-badge-gray">Hidden</span>{" "}
              instead of deleting it — hidden rows stay in the panel and can be
              switched back on later.
            </p>
          </Card>
        </Cards>

        <Note
          tone="warning"
          title="A draft that is never published is invisible"
        >
          Pressing <UI>Save</UI> on a live-preview editor is safe, but it is not
          the finish line. Nobody outside this panel sees the change until you
          press <UI>Save &amp; Publish</UI>.
        </Note>

        <H3>Why the site did not change yet</H3>
        <P>
          Public pages are cached so they load fast. Publishing refreshes the
          pages that were affected, but a page can still hold an older copy for
          up to an hour — and browsers keep their own copy on top of that.
        </P>
        <Steps>
          <li>
            Reload the public page with a hard refresh (<Key>Ctrl</Key>{" "}
            <Key>Shift</Key> <Key>R</Key>).
          </li>
          <li>Try it in a private window, which has no old copy to reuse.</li>
          <li>
            Still old? Ask an admin to press <UI>Clear cache</UI> in the top
            bar. Every public page then rebuilds on its next visit.
          </li>
        </Steps>
      </>
    ),
  },

  /* ── 4. Live-preview editors ────────────────────────────────────────────*/
  {
    id: "live-editors",
    title: "Editing a page with live preview",
    icon: MousePointerClick,
    summary: "Click a section on the page, edit it in the panel, publish.",
    keywords:
      "live preview inspector click to edit section panel about coe campus life research clubs committees naac documents accreditations content page tabs",
    body: () => (
      <>
        <P>
          These editors show the actual public page rather than a form. What you
          see is what a visitor will get — the same components render both.
        </P>

        <Steps>
          <li>
            Open the page from the sidebar. It loads with the current draft
            already applied.
          </li>
          <li>
            Move the pointer over the page. Editable sections highlight. Click
            the one you want.
          </li>
          <li>
            A panel slides in from the right with just that section&apos;s
            fields. Edit them — the preview updates as you type.
          </li>
          <li>
            Press <UI>Save</UI> to keep a draft, or <UI>Save &amp; Publish</UI>{" "}
            to put it live. Both buttons appear at the top of the screen and at
            the bottom of the panel, and both do the same thing.
          </li>
          <li>
            Close the panel with the × to pick a different section. Closing it
            does not discard anything — your edits stay in the preview until you
            save or leave the screen.
          </li>
        </Steps>

        <H3>Pages that contain other pages</H3>
        <P>
          A few pages publish smaller pages as tabs inside themselves — the
          Timeline inside About Us, NIRF and the financial statements inside
          Reports &amp; Downloads, the NAAC sub-pages inside NAAC, the gallery
          inside Placements. You edit those tabs here too: click the tab in the
          preview and its own fields open in the same panel. One{" "}
          <UI>Save &amp; Publish</UI> covers the whole page and all its tabs.
        </P>

        <Note tone="warning" title="Leaving the screen drops unsaved edits">
          There is no automatic save. If you close the tab or click away to
          another screen with unsaved changes, they are gone. Save before you
          navigate.
        </Note>
      </>
    ),
  },

  /* ── 5. Section forms ───────────────────────────────────────────────────*/
  {
    id: "forms",
    title: "Editing a section form",
    icon: FileEdit,
    summary: "The straight forms behind the landing pages and site-wide bits.",
    keywords:
      "page content form fields hero navbar footer admissions statistics validation error required save gold button",
    body: () => (
      <>
        <P>
          Each entry in a college&apos;s <UI>Landing Page</UI> group, and each
          entry under <UI>Global CMS</UI> and <UI>Main Website</UI>, opens one
          form for one block of one page. Fill it in and press the gold{" "}
          <UI>Save</UI>.
        </P>

        <H3>What you will meet in these forms</H3>
        <Defs
          rows={[
            {
              term: "Repeating rows",
              body: "Lists such as navbar links, statistics or steps. Use Add to append a row, the handle at its left to drag it into order, and the bin icon to remove it. The order here is the order on the page.",
            },
            {
              term: "Collapsible groups",
              body: "Long forms fold into named groups. Click a heading to open it. Only the fields you open are in your way.",
            },
            {
              term: "Image fields",
              body: "See the Images and PDFs chapter — picking a file does not upload it until you save.",
            },
            {
              term: "Visible / Hidden switches",
              body: "Many blocks can be switched off without losing their content. Turning a block off removes it from the public page; the text stays here for next time.",
            },
          ]}
        />

        <H3>If the save is refused</H3>
        <P>
          A red box appears at the top listing exactly which fields are wrong
          and why — a heading that is too long, a link that is not a valid
          address, a required field left empty. Fix those fields and press{" "}
          <UI>Save</UI> again. Nothing was written, so nothing is half-saved.
        </P>

        <Note tone="info">
          These forms publish as soon as you save. If you need to prepare a
          change without showing it yet, switch the block to hidden, save, and
          switch it back on when you are ready.
        </Note>
      </>
    ),
  },

  /* ── 6. Programs ────────────────────────────────────────────────────────*/
  {
    id: "programs",
    title: "Programs and their pages",
    icon: GraduationCap,
    summary: "Course cards, the tabbed program page, and publishing it.",
    keywords:
      "program course department degree slug seats duration curriculum syllabus faculty hod tabs sidebar outcomes archive sort order builder",
    body: () => (
      <>
        <P>
          A program is two things at once: the <strong>card</strong> that
          appears in the college&apos;s course listing, and the{" "}
          <strong>full page</strong> behind it. Both are edited on the same
          screen, in a builder with the fields on one side and the real page on
          the other.
        </P>

        <H3>Adding a program</H3>
        <Steps>
          <li>
            Open <UI>Programs</UI> for the college and press <UI>New</UI>.
          </li>
          <li>
            Fill the card fields: name, short form, degree, duration, seats, a
            one-line description and a card image.
          </li>
          <li>
            The <UI>Slug</UI> is the address the page will live at. Keep it
            short, lower case and hyphenated (<UI>computer-science</UI>). Two
            colleges may use the same slug; two programs in the <em>same</em>{" "}
            college may not.
          </li>
          <li>
            Press <UI>Create Program</UI>. The full page editor opens.
          </li>
        </Steps>

        <H3>Building the page</H3>
        <P>
          The page has a set of built-in tabs — overview, curriculum, faculty
          and so on — filled from the fields on the left. Beyond those you can:
        </P>
        <Bullets>
          <li>Reorder, rename or hide any tab.</li>
          <li>Point a tab at another page instead, so it acts as a link.</li>
          <li>Add a tab of your own and build it from content blocks.</li>
          <li>
            Rename the headings and table columns inside a tab, where a
            department words something differently.
          </li>
          <li>
            Set the page&apos;s search-engine title and description, which
            publish along with the rest.
          </li>
        </Bullets>

        <H3>Publishing</H3>
        <P>
          <UI>Save</UI> stores a draft; <UI>Save &amp; Publish</UI> makes the
          current draft the live page. The badge next to the title tells you
          which state the program is in. Nothing you type reaches the public
          course listing until the program is published <em>and</em> visible.
        </P>

        <Note tone="info" title="Retiring a program">
          Set it to <span className="admin-badge admin-badge-gray">Hidden</span>{" "}
          rather than deleting it. The page disappears from the site but the
          content — and its images — stay here should the course return.
        </Note>
      </>
    ),
  },

  /* ── 7. Lists ───────────────────────────────────────────────────────────*/
  {
    id: "records",
    title: "News, events, blogs and testimonials",
    icon: ListChecks,
    summary: "The list screens: add a row, fill it, save, it is live.",
    keywords:
      "news events blog post testimonial recruiter list table add row delete slug excerpt cover image category author date",
    body: () => (
      <>
        <P>
          These screens are lists. Press <UI>New</UI>, fill the row in the panel
          that opens, save, and it is on the site. There is no draft step — use
          the visibility switch to hold something back.
        </P>

        <H3>News &amp; Events</H3>
        <P>
          Title, address slug, date, category, location, cover image, a short
          card summary and the full detail text. Entries appear in that
          college&apos;s events listing and feed the events strip on its landing
          page. The wording <em>around</em> that strip — its heading and
          subtitle — is edited separately under{" "}
          <UI>News &amp; Events Section</UI> in the Landing Page group.
        </P>

        <H3>Blogs</H3>
        <P>
          Title, slug, publish date, category, author, cover image, summary and
          the post body. A post is owned by the college you created it in — that
          is what decides who may edit it — but every post publishes to the one
          site-wide <UI>/blogs</UI> listing.
        </P>

        <H3>Testimonials</H3>
        <P>
          A quote, who said it, their role or batch, and a photo. Each one can
          be scoped to a single college or shown on the home page.
        </P>

        <H3>Recruiters</H3>
        <P>
          The recruiter logos on the landing page are not typed in here — they
          are collected from the year-wise placement records. Adding a company
          to a placement year adds its logo to the carousel; the same company
          named in two colleges appears once.
        </P>

        <Note tone="warning" title="Deleting a row is permanent">
          There is no undo and no recycle bin. If you only want something off
          the site, switch it to{" "}
          <span className="admin-badge admin-badge-gray">Hidden</span>.
        </Note>
      </>
    ),
  },

  /* ── 8. Placements ──────────────────────────────────────────────────────*/
  {
    id: "placements",
    title: "Placements",
    icon: Award,
    summary:
      "One screen for the page layout, the yearly figures and the gallery.",
    keywords:
      "placement placements year records recruiters companies package salary statistics gallery photos highest average",
    body: () => (
      <>
        <P>
          Everything about placements is edited from <UI>Placements</UI> in the
          college&apos;s <UI>Other Pages</UI> group. One screen owns the page
          layout, the year-by-year records and the photo gallery tab —
          deliberately, so two screens can never disagree about the same
          numbers.
        </P>

        <H3>Year records</H3>
        <Bullets>
          <li>
            Each year is one record: the headline figures and the list of
            recruiting companies.
          </li>
          <li>
            A college may have only one record per year. Adding a year offers
            the next free one.
          </li>
          <li>
            Company names entered here are what fills the recruiter carousel on
            the landing page.
          </li>
        </Bullets>

        <Note tone="warning" title="Year figures do not wait for publish">
          The page layout follows the usual draft rules, but the year records do
          not have a draft version. Editing a figure and pressing <UI>Save</UI>{" "}
          updates it on the site straight away.
        </Note>
      </>
    ),
  },

  /* ── 9. Media ───────────────────────────────────────────────────────────*/
  {
    id: "media",
    title: "Images and PDFs",
    icon: ImageIcon,
    summary: "How uploads work, what sizes are allowed, and replacing a file.",
    keywords:
      "image upload photo picture jpg png webp gif size limit 10mb pdf document prospectus brochure download replace delete alt text ratio crop",
    body: () => (
      <>
        <H3>Picking an image</H3>
        <P>
          Choosing a file does <em>not</em> upload it. The panel shows your file
          in the preview immediately and uploads it when you save. That way a
          change you abandon never leaves a stray file behind.
        </P>
        <Steps>
          <li>
            Choose the shape first, where the field offers one — hero, card,
            square or portrait. The image is resized to that shape on upload, so
            the preview and the live page always agree.
          </li>
          <li>Pick the file. It appears in the preview at once.</li>
          <li>
            Save the screen. The upload happens now, and the field is pointed at
            the stored file.
          </li>
        </Steps>

        <H3>What is accepted</H3>
        <Defs
          rows={[
            {
              term: "Images",
              body: "JPG, PNG, WebP or GIF, up to 10 MB. Larger files are refused with a message saying so. Every upload is converted for the web, so a large photo does not slow the page down.",
            },
            {
              term: "Documents",
              body: "PDF only, up to 25 MB. Used for prospectuses, reports, disclosures and anything with a download link.",
            },
          ]}
        />

        <H3>Replacing and removing</H3>
        <P>
          Picking a new file in a field that already has one replaces it. Once
          the change is published, the old file is deleted — unless the same
          file is still used somewhere else on the site, in which case it is
          kept. You do not have to tidy up after yourself.
        </P>

        <Note tone="info" title="Write the alt text">
          Where a field asks for a description of the image, fill it in. It is
          what a screen reader reads aloud, and what shows if the image fails to
          load. One short factual sentence is enough.
        </Note>
      </>
    ),
  },

  /* ── 10. Dynamic pages ──────────────────────────────────────────────────*/
  {
    id: "pages",
    title: "Dynamic pages",
    icon: Table,
    summary: "Building a standalone page that did not exist before.",
    keywords:
      "dynamic page standalone new page template slug orphan not linked navbar blocks hero sidebar gallery contact",
    body: () => (
      <>
        <P>
          <UI>Dynamic Pages</UI> under <UI>Admin Tools</UI> is for a page that
          has no home anywhere else — a one-off notice, a scheme description, a
          landing page for a campaign. You choose which site it belongs to, pick
          a layout template, and build the body from content blocks.
        </P>

        <Steps>
          <li>
            Press <UI>New</UI>, then set the title, the address slug and which
            site the page belongs to.
          </li>
          <li>
            Pick a template. It decides the frame — plain, hero at the top, with
            a sidebar, a gallery, or a contact layout.
          </li>
          <li>Add the body blocks and fill them in.</li>
          <li>
            <UI>Save</UI> keeps a draft. <UI>Save &amp; Publish</UI> puts it
            online.
          </li>
        </Steps>

        <Note tone="info" title="The “not linked” badge">
          The page list flags any published page that no menu links to. The page
          works — but the only way to reach it is to know the address. Either
          add a link in the relevant Navbar or Footer screen, or accept that it
          is meant to be shared by link alone.
        </Note>
      </>
    ),
  },

  /* ── 11. Screen reference ───────────────────────────────────────────────*/
  {
    id: "screens",
    title: "Every screen, explained",
    icon: MapIcon,
    summary: "A one-line reference for each page you can open.",
    keywords:
      "reference index list of screens all pages sitemap what does this screen do directory",
    body: (ctx) => <ScreenReference {...ctx} />,
  },

  /* ── 12. People ─────────────────────────────────────────────────────────*/
  {
    id: "people",
    title: "People and access",
    icon: Users,
    summary: "Creating accounts, choosing a role, resetting a password.",
    keywords:
      "user users people account role admin editor permission scope college password reset remove access",
    minRole: "admin",
    body: () => (
      <>
        <P>
          <UI>People</UI> lists everyone who can sign in and what they are
          allowed to change. Only admins can open it.
        </P>

        <Steps>
          <li>
            Press <UI>New</UI> and enter their full name, email and a starting
            password. They sign in at <UI>/admin/login</UI> with exactly those.
          </li>
          <li>
            Choose the role. <UI>Editor</UI> then also needs a college — that is
            the only content they will be able to open. <UI>Admin</UI> covers
            everything and takes no college.
          </li>
          <li>Save. They can sign in straight away.</li>
        </Steps>

        <H3>Changing an account</H3>
        <Bullets>
          <li>
            Open the person and edit any field. Leave the password box empty to
            keep their current password; type a new one to replace it.
          </li>
          <li>
            Moving someone between colleges is a role change, not a new account
            — edit the college they can edit.
          </li>
          <li>
            When someone leaves, delete the account. Their past changes stay in
            the audit log under their email.
          </li>
        </Bullets>

        <Note tone="warning" title="Give the narrowest role that works">
          An editor scoped to one college cannot damage another college&apos;s
          pages, cannot reach the site-wide settings, and cannot reset the site.
          Hand out <UI>Admin</UI> only to the people who need those.
        </Note>
      </>
    ),
  },

  /* ── 13. Audit ──────────────────────────────────────────────────────────*/
  {
    id: "audit",
    title: "Audit log",
    icon: ShieldCheck,
    summary: "Who changed what, and when.",
    keywords:
      "audit log history activity trail who changed what when retention purge accountability",
    minRole: "admin",
    body: () => (
      <>
        <P>
          Every write made in this panel is recorded: what kind of content, what
          happened to it, which account did it, a one-line summary and the time.
          The newest entries also appear on the dashboard.
        </P>
        <P>
          Entries are kept for one year and then removed automatically. The{" "}
          <UI>Audit log</UI> screen can also clear entries older than a chosen
          age, if you need to trim the list sooner.
        </P>
        <Note tone="info">
          The log records that a change was made, not the content before and
          after. It answers &ldquo;who touched the Engineering hero on
          Tuesday&rdquo;. To recover the old wording, you need a backup.
        </Note>
      </>
    ),
  },

  /* ── 14. Backup ─────────────────────────────────────────────────────────*/
  {
    id: "backup",
    title: "Backup, restore and reset",
    icon: DatabaseBackup,
    summary: "Taking an archive, putting one back, and the reset button.",
    keywords:
      "backup restore archive export download zip schedule automatic daily weekly monthly retention merge replace reset wipe purge danger disaster recovery",
    minRole: "admin",
    body: () => (
      <>
        <P>
          <UI>Backup &amp; restore</UI> is the safety net for everything in this
          panel. It is admin-only, and worth understanding <em>before</em> you
          need it.
        </P>

        <H3>Taking a backup</H3>
        <Steps>
          <li>
            Choose whether to include the uploaded files. Content alone is
            small; with every image and PDF the archive runs to several
            gigabytes and takes a while.
          </li>
          <li>
            Start the export. It builds in the background and shows progress —
            you can leave the screen and come back.
          </li>
          <li>
            When it is ready, download it and keep it somewhere off this server.
            A backup that only exists on the machine it backs up is not a
            backup.
          </li>
        </Steps>

        <H3>Automatic backups</H3>
        <P>
          Switch them on and pick daily, weekly or monthly, the time of day, and
          how many to keep. Automatic archives are kept until that count is
          exceeded — they are not deleted for being old, so a weekly schedule
          always has something to restore from. Manual archives are cleared out
          within a day, so download them.
        </P>

        <H3>Restoring</H3>
        <P>Upload an archive and choose how it should be applied:</P>
        <Defs
          rows={[
            {
              term: "Merge",
              body: "Everything in the archive is written back over what is here. Anything created since the backup is left alone. This is the safe default.",
            },
            {
              term: "Replace",
              body: "As above, and anything not in the archive is deleted, so the site ends up exactly as it was when the backup was taken. Anything added since is lost.",
            },
          ]}
        />
        <P>
          A large restore takes a long time and reports progress as it goes.
          Leave the tab open.
        </P>

        <Note tone="danger" title="Reset All Data cannot be undone">
          Reset erases the site&apos;s configuration, and — if you tick the
          extra boxes — every program, page, event, placement and testimonial,
          and every uploaded file. Accounts and the audit log survive; nothing
          else does. There is no undo. The only way back is a backup you already
          took. Take one first, and read the confirmation prompt rather than
          clicking through it.
        </Note>
      </>
    ),
  },

  /* ── 15. Troubleshooting ────────────────────────────────────────────────*/
  {
    id: "trouble",
    title: "When something looks wrong",
    icon: LifeBuoy,
    summary: "The handful of things that actually go wrong, and the fix.",
    keywords:
      "problem trouble error not showing missing broken image blank page cannot save 403 forbidden session expired stale cache help",
    body: () => (
      <>
        <Defs
          rows={[
            {
              term: "I saved, but the site still shows the old version",
              body: "Either the change is still a draft — check for a Save & Publish button you did not press — or the page is cached. Hard refresh, try a private window, then ask an admin to press Clear cache.",
            },
            {
              term: "My edit vanished",
              body: "Leaving a live-preview editor without saving discards the draft. There is no automatic save. Redo the edit and save before navigating away.",
            },
            {
              term: "Save is refused with red text",
              body: "The listed fields did not pass validation — usually text that is too long, an address that is not a valid link, or a required field left blank. Nothing was saved, so fix the fields and save again.",
            },
            {
              term: "A screen says I am not allowed",
              body: "You are an editor and the content belongs to another college, or to the site-wide settings. That is the scope working as intended. Ask an admin.",
            },
            {
              term: "The panel sent me back to the login page",
              body: "Sessions last 24 hours. Sign in again; you will be returned to where you were.",
            },
            {
              term: "An image will not upload",
              body: "Check the format (JPG, PNG, WebP or GIF) and the size — 10 MB for images, 25 MB for PDFs. The message under the field says which rule was broken.",
            },
            {
              term: "An image shows as a broken box on the site",
              body: "The file it points at is gone — usually because it was deleted from elsewhere while this page still referenced it. Pick the image again and republish.",
            },
            {
              term: "A page exists but nothing links to it",
              body: "Check the Dynamic Pages list for the “not linked” badge, then add the link in the relevant Navbar or Footer screen.",
            },
            {
              term: "Everything is failing at once",
              body: "If the dashboard shows a database warning, the panel cannot reach its database. Nothing is lost, but do not keep editing — report it.",
            },
          ]}
        />
      </>
    ),
  },

  /* ── 16. Glossary ───────────────────────────────────────────────────────*/
  {
    id: "glossary",
    title: "Glossary",
    icon: BookOpen,
    summary: "The words this panel uses, in plain English.",
    keywords:
      "glossary terms definitions vocabulary meaning draft published slug section inspector scope cache revalidate",
    body: () => (
      <Defs
        rows={[
          {
            term: "Draft",
            body: "A saved change that is not on the public site yet. Only people signed in here can see it.",
          },
          {
            term: "Published",
            body: "The version visitors are reading right now.",
          },
          {
            term: "Visible / Hidden",
            body: "Whether a row appears on the site at all. Separate from draft and published — a published program that is hidden is still invisible.",
          },
          {
            term: "Slug",
            body: "The last part of a web address — the “computer-science” in /programs/computer-science. Lower case, hyphens, no spaces.",
          },
          {
            term: "Section",
            body: "One block of a page: the hero, the statistics strip, the admissions box. Sidebar entries under Landing Page are sections.",
          },
          {
            term: "Inspector",
            body: "The panel that slides in from the right in the live-preview editors, holding the fields for whichever section you clicked.",
          },
          {
            term: "Scope",
            body: "Which college an account may edit. Admins have no scope limit; an editor has exactly one college.",
          },
          {
            term: "Cache",
            body: "A stored copy of a public page, kept so it loads fast. Publishing refreshes it; Clear cache forces every page to rebuild.",
          },
          {
            term: "Landing page",
            body: "The front page of a site — the main home page, or a college's own front page.",
          },
          {
            term: "Content page",
            body: "A page built from stacked blocks (text, tables, downloads) rather than a fixed layout — the library page, NSS, mandatory disclosures and similar.",
          },
        ]}
      />
    ),
  },
];

/** Chapters this account is allowed to read. */
export function visibleChapters(role: string): HelpChapter[] {
  return HELP_CHAPTERS.filter((c) => hasMinRole(role, c.minRole ?? "editor"));
}
