ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //var $el = $(element);

        //initialize datepicker with some optional options
        var options = allBindingsAccessor().datepickerOptions || {},
            prop = valueAccessor(),
            $elem = $(element);

        prop($elem.val());

        $elem.datepicker(options);

        /* Handle the field changing */
        ko.utils.registerEventHandler(element, "change", function () {
            prop($elem.datepicker("getDate"));
        });

        /* Handle disposal (if KO removes by the template binding) */
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $elem.datepicker("destroy");
        });
    },
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
            $elem = $(element),
            current = $elem.datepicker("getDate");

        if (String(value).indexOf('/Date(') == 0) {
            value = new Date(parseInt(value.replace(/\/Date\((.*?)\)\//gi, "$1")));
        } else if(value) {
            value = new Date(value);
        }

        //if (value - current !== 0) {
            $elem.datepicker("setDate", value);        
        //}


    }
};

ko.bindingHandlers.dateTimePicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().dateTimePickerOptions || {};
        $(element).datetimepicker(options);

        //when a user changes the date, update the view model
        ko.utils.registerEventHandler(element, "change dp.change", function (event) {
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                if (event.date === false) {
                    value(null);
                } else {
                    value(event.date);
                }
            }
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            var picker = $(element).data("DateTimePicker");
            if (picker) {
                picker.destroy();
            }
        });
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var picker = $(element).data("DateTimePicker");
        //when the view model is updated, update the widget
        if (picker) {
            var koDate = ko.utils.unwrapObservable(valueAccessor());

            //in case return from server datetime i am get in this form for example /Date(93989393)/ then fomat this
            koDate = (typeof (koDate) !== 'object') ? new Date(parseFloat(koDate.replace(/[^0-9]/g, ''))) : koDate;

            picker.date(koDate);
        }
    }
};

ko.bindingHandlers.date = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var jsonDate = valueAccessor();
        var koDate =new Date(parseInt(jsonDate().replace(/\/Date\((.*?)\)\//gi, "$1")));
        element.innerHTML = moment(koDate).format();

    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {

    }
};

ko.extenders.numeric_double_precision = function (target, precision) {
    var result = ko.dependentObservable({
        read: function () {
            if (target().toString().length == 1) {
                return '0' + target();
            }

            return target();
        },
        write: target
    });

    result.raw = target;
    return result;
};

ko.bindingHandlers.masked = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var mask = allBindingsAccessor().mask || {};
        $(element).mask(mask);
        ko.utils.registerEventHandler(element, 'focusout', function () {
            var observable = valueAccessor();
            observable($(element).val());
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).val(value);
    }
};

ko.bindingHandlers.wysihtml5 = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {

        var options = {};
        var value = ko.utils.unwrapObservable(valueAccessor()) || {};

        options.events = {
            "change": function () {
                var observable;
                var content = ko.utils.unwrapObservable(valueAccessor()) || {};

                if (content.data != undefined) {
                    observable = valueAccessor().data;
                } else {
                    observable = valueAccessor();
                }

                observable(control.getValue());
            }
        };

        // if the textarea has no id, generate one to keep wysihtml5 happy
        if ($(element).attr('id') == undefined || $(element).attr('id') == '')
            $(element).attr('id', 'id_' + Math.floor(new Date().valueOf()));

        var control = $(element).wysihtml5(options).data("wysihtml5").editor;

    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        //
        var control = $(element).data("wysihtml5").editor;
        var content = ko.utils.unwrapObservable(valueAccessor()) || {};

        if (content.data != undefined) {
            control.setValue(valueAccessor().data());
        } else {
            control.setValue(valueAccessor()());
        }
    }
};