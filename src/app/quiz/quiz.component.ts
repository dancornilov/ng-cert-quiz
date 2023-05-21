import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {Question} from '../data.models';
import {QuizService} from '../quiz.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {
  @Input() questions: Question[] | null = [];
  @Output() changeQuestion: EventEmitter<Question> = new EventEmitter<Question>();

  userAnswers: string[] = [];
  quizService = inject(QuizService);
  router = inject(Router);
  hideChangeButton: boolean = false;

  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl("/result");
  }

}
