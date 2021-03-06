/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../ui/tour-listbox.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {

        export interface IFormToursListInfo extends CZ.UI.IFormBaseInfo {
            tourTemplate: JQuery;
            tours: any;
            takeTour: (tour: any) => void;
            editTour: (tour: any) => void;
            createTour: string;
        }

        export class FormToursList extends CZ.UI.FormBase {

            private toursListBox: TourListBox;
            private isCancel: boolean;
            private takeTour: (tour: any) => void;
            private editTour: (tour: any) => void;
            private createTourBtn: JQuery;
            private tourAmount;

            // We only need to add additional initialization in constructor.
            constructor(container: JQuery, formInfo: IFormToursListInfo) {
                super(container, formInfo);
                this.tourAmount = formInfo.tours.length;
                this.takeTour = formInfo.takeTour;
                this.editTour = formInfo.editTour;
                var tours = formInfo.tours.sort((a, b) => a.sequenceNum - b.sequenceNum);
                this.toursListBox = new CZ.UI.TourListBox(container.find("#tours"), formInfo.tourTemplate, formInfo.tours,
                    tour => {
                        this.onTakeTour(tour);
                    },
                    this.editTour ? tour => { this.onEditTour(tour); } : null);
                this.createTourBtn = this.container.find(formInfo.createTour);
                if ((CZ.Settings.isAuthorized) && (CZ.Settings.userCollectionName == CZ.Service.collectionName)) $("#cz-tours-list-title").text("My Tours");
                else {
                    $("#cz-tours-list-title").text("Tours");
                    $("#tours-create-button").hide();
                }

                if (formInfo.tours.length != 0) {
                    $("#take-tour-proposal").show();
                    $("#tours-missed-warning").hide();
                } else {
                    $("#take-tour-proposal").hide();
                    $("#tours-missed-warning").show();
                }
                if (formInfo.tours.length == 0) $("#take-tour-proposal").hide();
                this.initialize();
            }

            private initialize(): void {
                this.createTourBtn.click(event => {
                    CZ.Authoring.UI.createTour();
                    this.close();
                });

            }

            public show(): void {
                var self = this;
                $(window).resize(this.onWindowResize);
                this.onWindowResize(null);

                super.show({
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });

                this.activationSource.addClass("active");
            }

            public close() {
                $(window).unbind("resize", this.onWindowResize);

                super.close({
                    effect: "slide",
                    direction: "right",
                    duration: 500,
                    complete: () => {
                        this.container.find("cz-form-errormsg").hide();
                        this.container.find("#tours").empty();
                        this.toursListBox.container.empty();
                    }
                });

                CZ.Authoring.isActive = false;

                this.activationSource.removeClass("active");
            }

            private onTakeTour(tour) {
                this.close();
                this.takeTour(tour);
            }

            private onEditTour(tour) {
                this.close();
                this.editTour(tour);
            }

            private onWindowResize(e: JQueryEventObject) {
                var height = $(window).height();
                this.container.height(height - 70);
                this.container.find("#tour-listbox-wrapper").css("max-height",(height - 250) + "px");
            }
        }
    }
}