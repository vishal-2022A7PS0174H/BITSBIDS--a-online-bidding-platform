import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from './alert.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [CommonModule, TranslateModule],
    declarations: [AlertComponent],
    exports: [AlertComponent]
})
export class AlertModule { }
