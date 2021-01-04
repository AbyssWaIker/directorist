import validation from './../validation';
import field_helper from './helper.js';

export default {
    mixins: [ validation, field_helper ],
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        theme: {
            type: String,
            default: 'default'
        },
        type: {
            type: String,
            required: false,
            default: 'text',
        },
        label: {
            type: String,
            required: false,
            default: '',
        },
        description: {
            type: String,
            required: false,
            default: '',
        },
        value: {
            required: false,
            default: '',
        },
        name: {
            type: [String, Number],
            required: false,
            default: '',
        },
        placeholder: {
            type: [String, Number],
            required: false,
            default: '',
        },
        rules: {
            type: Object,
            required: false,
        },
        validationFeedback: {
            type: Object,
            required: false,
        },
        validation: {
            type: Array,
            required: false,
        },
        input_style: {
            type: Object,
            required: false,
        },
    },

    computed: {
        input_type() {
            const supported_types = {
                'text-field': 'text', 
                'number-field': 'number', 
                'password-field': 'password', 
                'date-field': 'date',
                'hidden-field': 'hidden', 
                'text': 'text', 
                'number': 'number', 
                'password': 'password', 
                'date': 'date',
                'hidden': 'hidden', 
            };

            if ( typeof supported_types[ this.type ] !== 'undefined' ) {
                return supported_types[ this.type ];
            }
            
            return 'text';
        },

        formGroupClass() {
            return {
                ...this.validationClass,
                'cptm-mb-0': ( 'hidden' === this.input_type ) ? true : false,
            }
        },

        formControlClass() {
            let class_names = {};

            if ( this.input_style && this.input_style.class_names  ) {
                class_names[ this.input_style.class_names ] = true;
            }
            
            return class_names;
        }
    },

    data() {
        return {

        }
    },
}