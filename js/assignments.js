import pageCountdownTime from './page-countdown-time.js';
import pageLink from './page-link.js';
import pageSectionTitle from './page-section.js';
import pageTable from './page-table.js';


const hiddenLink = {
    props: {
        now: Object,
        hide: {
            type: Boolean,
            default: null
        },
        hideUntil: {
            type: Object,
            default: null,
        },
        name: String,
        href: String,
    },
    computed: {
        willHide: function() {
            if (this.hide === null) {
                return this.hide || this.hideUntil === null || this.hideUntil.isAfter(this.now);
            } else {
                return this.hide;
            }
        },
    },
    template: `
        <span v-if="willHide">{{name}}</span>
        <page-link
          v-else
          :href="href"
          :text="name">
        </page-link>
    `
};


const courseAssignment = {
    props: {
        name: String,
        handoutURL: String,
        out: String,
        due: String,
        solutionURL: String,
        now: Object,
    },
    components: {
        'hidden-link': hiddenLink,
        'page-countdown-time': pageCountdownTime,
        'page-link': pageLink,
    },
    data: function() {
        return {
            outMoment: this.parseTime(this.out),
            dueMoment: this.parseTime(this.due),
        };
    },
    methods: {
        parseTime: function(timeStr) {
            let timeObj = moment(timeStr, ['MM/DD', 'YYYY/MM/DD']);
            if (timeObj.isValid()) {
                timeObj.hour(18);
                timeObj.minute(0);
            } else {
                timeObj = moment(timeStr, ['MM/DD HH:mm', 'MM/DD hh:mm a', 'MM/DD hh a', 'YYYY/MM/DD HH:mm', 'YYYY/MM/DD hh:mm a', 'YYYY/MM/DD hh a']);
            }
            return timeObj;
        },
    },
    template: `
        <tr>
            <th scope="row">
                <hidden-link
                  :name="name"
                  :href="handoutURL"
                  :hideUntil="outMoment"
                  :now="now"
                >
                </hidden-link>
            </th>
            <td>
                <page-countdown-time
                  name="out"
                  :time="outMoment"
                  :now="now"
                >
                </page-countdown-time>
            </td>
            <td>
                <page-countdown-time
                  name="due"
                  :time="dueMoment"
                  :now="now"
                >
                </page-countdown-time>
            </td>
            <td>
                <hidden-link
                  name="Solution"
                  :href="solutionURL"
                  :hide="true"
                  :hideUntil="dueMoment"
                  :now="now"
                >
                </hidden-link>
            </td>
        </tr>
    `,
};

Vue.component('page-content', {
    props: {
        curPageThemeColor: String,
        curPageIconClasses: Array,
    },
    components: {
        'course-assignment': courseAssignment,
        'page-table': pageTable,
        'page-section-title': pageSectionTitle,
    },
    data: function() {
        return {
            assignments: [
                {
                    name: 'Assignment 0',
                    handoutURL: '',
                    out: '09/05',
                    due: '09/06',
                    solutionURL: '',
                },
            ],
            now: moment(),
            tableheads: ['assignment #', 'out', 'due', 'solution'],
        };
    },
    created: function() {
        setInterval(() => this.now = moment(), 1000);
    },
    mounted: function() {
        const element = this.$el;
        document.addEventListener('DOMContentLoaded', function() {
            element.scrollIntoView(true);
            window.scrollBy(0, -150);
        }, false);
    },
    template: `
        <main>
            <section class="container-fluid d-flex flex-wrap flex-column my-5 px-5">
                <page-section-title
                  :background-color="curPageThemeColor"
                  :icon-classes="curPageIconClasses"
                  text-decoration-style="dashed"
                  text="course assignments"
                ></page-section-title>
                <div
                  class="mx-5 px-5"
                  :style="{ color: curPageThemeColor}"
                >
                    <page-table
                      :tableheads="tableheads"
                      tableheadBackground="rgba(111, 82, 142, 0.2)"
                    >
                        <course-assignment
                          v-for="(assignment, index) of assignments"
                          :key="index"
                          v-bind="assignment"
                          :now="now"
                        >
                        </course-assignment>
                    </page-table>
                </div>
            </section>
        </main>
    `
});